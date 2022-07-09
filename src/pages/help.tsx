import type { NextPageWithLayout } from '@/types';
import GeneralLayout from '@/layouts/_general-layout';
import PageHeading from '@/components/ui/page-heading';
import GeneralContainer from '@/layouts/_general-container';
import Accordion from '@/components/ui/accordion';
import Seo from '@/layouts/_seo';
import { helpData } from '@/data/static/help-setting';
import routes from '@/config/routes';

const HelpPage: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="Help"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.help}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col p-4 sm:p-5">
        <PageHeading title="Help" subtitle="Frequently asked question" />
        <GeneralContainer>
          {helpData?.map((item) => (
            <Accordion key={`${item.title}-${item.id}`} item={item} />
          ))}
        </GeneralContainer>
      </div>
    </>
  );
};

HelpPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>;
};

export default HelpPage;
