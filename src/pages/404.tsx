import type { NextPageWithLayout } from '@/types';
import Layout from '@/layouts/_layout';
import { ErrorIcon } from '@/components/icons/error-icon';
import { HomeIcon } from '@/components/icons/home-icon';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import Seo from '@/layouts/_seo';
const ErrorPage: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="404 Error"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url="/404"
      />
      <div className="flex h-full items-center justify-center p-4 md:p-6 xl:p-8">
        <div className="max-w-md text-center xl:max-w-lg">
          <ErrorIcon className="mx-auto h-36 w-36 text-light-900 dark:text-dark-600" />

          <h2 className="pt-5 text-base font-semibold text-dark dark:text-light md:pt-7">
            No page found
          </h2>
          <p className="pt-2.5">
            The page you were looking for isn&apos;t here
          </p>
          <AnchorLink
            href={routes?.home}
            className="group mx-auto mt-7 inline-flex items-center gap-2 rounded border border-light-400 px-6 py-3.5 font-semibold text-dark transition-all hover:bg-light-400 hover:text-brand-dark dark:border-dark-400 dark:text-light dark:hover:bg-dark-400 dark:focus:bg-dark-400 md:mt-9"
          >
            <HomeIcon className="h-[18px] w-[18px] text-dark/40 group-hover:text-brand dark:text-light/60" />{' '}
            Back to home
          </AnchorLink>
        </div>
      </div>
    </>
  );
};

ErrorPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ErrorPage;
