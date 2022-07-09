import type { NextPageWithLayout } from '@/types';
import GeneralLayout from '@/layouts/_general-layout';
import PageHeading from '@/components/ui/page-heading';
import GeneralContainer from '@/layouts/_general-container';
import { termsData } from '@/data/static/terms-setting';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';

const TermsPage: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="Terms & Conditions"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.terms}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col p-4 sm:p-5">
        <PageHeading
          title="Terms and Conditions"
          subtitle="Last updated on January 20, 2022"
        />
        <GeneralContainer>
          {termsData?.map((item) => (
            <div
              key={item.id}
              className="order-list-enable mb-8 last:mb-0 lg:mb-10"
            >
              <h3 className="mb-4 text-sm font-medium text-dark dark:text-light lg:mb-5">
                {item.title}
              </h3>
              <div
                className="space-y-5 leading-6"
                dangerouslySetInnerHTML={{
                  __html: item.description,
                }}
              />
            </div>
          ))}
        </GeneralContainer>
      </div>
    </>
  );
};

TermsPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>;
};

export default TermsPage;
