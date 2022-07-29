import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '@/types';
import { useState, useEffect } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { validateEnvironmentVariables } from '@/config/validate-environment-variables';
import { CartProvider } from '@/components/cart/lib/cart.context';
import { ModalProvider } from '@/components/modal-views/context';
import ModalsContainer from '@/components/modal-views/container';
import DrawersContainer from '@/components/drawer-views/container';
import SearchView from '@/components/search/search-view';
import DefaultSeo from '@/layouts/_default-seo';
// base css file
import '@/assets/css/scrollbar.css';
import '@/assets/css/swiper-carousel.css';
import '@/assets/css/globals.css';
import { useRouter } from 'next/router';
import Layout from '@/layouts/_layout';
import UserContextProvider from '@/components/preppers/context';
import { SpinnerIcon } from '@/components/icons/spinner-icon';

import dynamic from 'next/dynamic';
const PrivateRoute = dynamic(() => import('@/layouts/_private-route'), {
  ssr: false,
});

validateEnvironmentVariables();

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout ?? ((page) => page);
  const authenticationRequired = Component.authorization ?? false;

  const router = useRouter();
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  useEffect(() => {
    const handleStart = () => {
      setPageLoading(true);
    };
    const handleComplete = () => {
      setPageLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
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
                console.log(
                  '====',
                  responseJson,
                  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                );
                setLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  address: responseJson.results[0]?.formatted_address || 'xxx',
                });
              });
          },
          (error) => {
            setLocation({
              latitude: 0.0,
              longitude: 0.0,
              address: 'xxx',
            });
          }
        );
      }
    };

    getMyLocation();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <UserContextProvider location={location}>
            <CartProvider>
              <ModalProvider>
                <AnimatePresence
                  exitBeforeEnter
                  initial={false}
                  onExitComplete={() => window.scrollTo(0, 0)}
                >
                  {pageLoading ? (
                    <Layout>
                      <div className="flex h-full items-center justify-center">
                        {/* <svg
                          className="text-grey-200 -ml-1 mr-3 h-12 w-12 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg> */}
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
                      <SearchView />
                      <ModalsContainer />
                      <DrawersContainer />
                      <Toaster containerClassName="!top-16 sm:!top-3.5 !bottom-16 sm:!bottom-3.5" />
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
