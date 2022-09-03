import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '@/types';
import { useState, useEffect } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Portal } from 'react-portal';
import { ThemeProvider } from 'next-themes';
import { validateEnvironmentVariables } from '@/config/validate-environment-variables';
import { CartProvider } from '@/components/cart/lib/cart.context';
import { ModalProvider } from '@/components/modal-views/context';
import ModalsContainer from '@/components/modal-views/container';
import DrawersContainer from '@/components/drawer-views/container';
import SearchView from '@/components/search/search-view';
import DefaultSeo from '@/layouts/_default-seo';
import Script from 'next/script';

// base css file
import '@/assets/css/scrollbar.css';
import '@/assets/css/swiper-carousel.css';
import '@/assets/css/globals.css';
import { useRouter } from 'next/router';
import Layout from '@/layouts/_general-layout';
import UserContextProvider from '@/components/preppers/context';
import { SpinnerIcon } from '@/components/icons/spinner-icon';
import { toast } from 'react-hot-toast';
import { PopupButton } from '@typeform/embed-react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import TagManager from 'react-gtm-module';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

import dynamic from 'next/dynamic';
import { TYPEFORM_KEY } from '@/lib/constants';
import * as fbq from '../lib/fpixel';
import * as branchio from '../lib/branchio';
import { Popover } from '@typeform/embed-react';
import Button from '@/components/ui/button';

const PrivateRoute = dynamic(() => import('@/layouts/_private-route'), {
  ssr: false,
});
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

validateEnvironmentVariables();

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout ?? ((page: any) => page);
  const authenticationRequired = Component.authorization ?? false;

  const router = useRouter();
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  const isMac =
    typeof window !== 'undefined'
      ? // navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
        navigator.platform.toUpperCase().indexOf('IPHONE') >= 0
      : true;

  useEffect(() => {
    // This pageview only triggers the first time (it's important for Pixel to have real information)
    fbq.pageview();

    const handleRouteChange = () => {
      fbq.pageview();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const handleStart = () => {
      setPageLoading(true);
    };
    const handleComplete = () => {
      setPageLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    // router.events.on('routeChangeError', handleComplete);
  }, [router]);

  const [location, setLocation] = useState({});

  useEffect(() => {
    const getMyLocation = () => {
      const location = window.navigator && window.navigator.geolocation;

      if (location) {
        location.getCurrentPosition(
          (position) => {
            fetch(
              'https://maps.googleapis.com/maps/api/geocode/json?address=' +
                position.coords.latitude +
                ',' +
                position.coords.longitude +
                '&key=' +
                process.env.NEXT_PUBLIC_GOOGLE_API_KEY
            )
              .then((response) => response.json())
              .then((responseJson) => {
                console.log('response json', responseJson);
                const postcode =
                  responseJson.results[0].address_components.find(
                    (addr: any) => addr.types[0] === 'postal_code'
                  )?.short_name || 'no-code';
                setLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  address: responseJson.results[0]?.formatted_address || 'xxx',
                  guestInfo: new Date().toString(),
                  postcode,
                });
              });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                toast.error(<b>User denied the request for Geolocation.</b>, {
                  className: '-mt-10 xs:mt-0',
                });
                break;
              case error.POSITION_UNAVAILABLE:
                toast.error(<b>Location information is unavailable.</b>, {
                  className: '-mt-10 xs:mt-0',
                });
                break;
              case error.TIMEOUT:
                toast.error(
                  <b>The request to get user location timed out.</b>,
                  {
                    className: '-mt-10 xs:mt-0',
                  }
                );
                break;
              default:
                toast.error(
                  <b>An unknown error occurred to get the geolocation.</b>,
                  {
                    className: '-mt-10 xs:mt-0',
                  }
                );
                break;
            }

            // setPageLoading(true);

            setLocation({
              latitude: 51.5256224,
              longitude: -0.0836253,
              address: '_',
              guestInfo: new Date().toString(),
              postcode: 'EC2A 4NE',
            });
          }
        );
      }
    };

    getMyLocation();
  }, []);

  const [typeformKey, saveTypeformKey] = useLocalStorage(TYPEFORM_KEY, '');

  useEffect(() => {
    // if (process.env.NODE_ENV === 'production') {
    TagManager.initialize({
      gtmId: 'GTM-TFJ56L7',
      dataLayerName: 'PageDataLayer',
    });
    const logEventC = (url: any) => {
      logEvent(analytics, 'screen_view', {
        firebase_screen: url,
        firebase_screen_class: url,
      });
    };

    router.events.on('routeChangeComplete', logEventC);
    //For First Page
    logEventC(window.location.pathname);

    //Remvove Event Listener after un-mount
    return () => {
      router.events.off('routeChangeComplete', logEventC);
    };
    // }
  }, []);

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(FB_PIXEL_ID!);
        ReactPixel.pageView();
        router.events.on('routeChangeComplete', () => {
          ReactPixel.pageView();
        });
      });
  }, [router.events]);

  useEffect(() => {
    branchio.initAndFetch();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Global Site Code Pixel - Facebook Pixel */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID});
          `,
        }}
      />
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <UserContextProvider location={location} setLocation={setLocation}>
            <CartProvider>
              <ModalProvider>
                <AnimatePresence
                  exitBeforeEnter
                  initial={false}
                  onExitComplete={() => window.scrollTo(0, 0)}
                >
                  {pageLoading ? (
                    <Layout>
                      <div className="flex h-full min-h-[calc(100vh-200px)] items-center justify-center">
                        <SpinnerIcon className="h-auto w-12 animate-spin" />
                      </div>
                    </Layout>
                  ) : (
                    <>
                      <DefaultSeo />
                      {authenticationRequired ? (
                        <PrivateRoute>
                          {getLayout(<Component {...pageProps} />)}
                        </PrivateRoute>
                      ) : (
                        getLayout(<Component {...pageProps} />)
                      )}
                      {/* <PopupButton
                        id={'jtWs4On7'}
                        style={{ position: 'fixed' }}
                        size={86}
                        autoResize
                        open={typeformKey !== 'loaded' ? 'time' : undefined}
                        openValue={15000}
                        onReady={() => saveTypeformKey('loaded')}
                        onClose={() => saveTypeformKey('loaded')}
                      ></PopupButton> */}

                      <SearchView />
                      <ModalsContainer />
                      <DrawersContainer />
                      <Portal>
                        <Toaster containerClassName="!top-16 sm:!top-3.5 !bottom-16 sm:!bottom-3.5" />
                      </Portal>
                    </>
                  )}
                </AnimatePresence>
              </ModalProvider>
            </CartProvider>
          </UserContextProvider>
        </ThemeProvider>
      </Hydrate>
      {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
    </QueryClientProvider>
  );
}

export default CustomApp;
