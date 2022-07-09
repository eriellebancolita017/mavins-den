import type { NextPageWithLayout } from '@/types';
import GeneralLayout from '@/layouts/_general-layout';
import PageHeading from '@/components/ui/page-heading';
import { DevelopmentIcon } from '@/components/icons/featured/development-icon';
import { DesignIcon } from '@/components/icons/featured/design-icon';
import { ResearchIcon } from '@/components/icons/featured/research-icon';
import { ManagementIcon } from '@/components/icons/featured/management-icon';
import { GlobalIcon } from '@/components/icons/featured/global-icon';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import Image from '@/components/ui/image';
import Seo from '@/layouts/_seo';
import placeholder from '@/assets/images/placeholders/product.svg';
import teamThumbOne from '@/assets/images/team/1.png';
import teamThumbTwo from '@/assets/images/team/2.png';
import teamThumbThree from '@/assets/images/team/3.png';
import teamThumbFour from '@/assets/images/team/4.png';
import teamThumbFive from '@/assets/images/team/5.png';
import teamThumbSix from '@/assets/images/team/6.png';

const featuredData = [
  {
    id: 1,
    icon: <DevelopmentIcon className="h-12 w-12 xl:h-[70px] xl:w-[70px]" />,
    title: 'App Development',
  },
  {
    id: 2,
    icon: <DesignIcon className="h-12 w-12 xl:h-[70px] xl:w-[70px]" />,
    title: 'Design & Research',
  },
  {
    id: 3,
    icon: <ResearchIcon className="h-12 w-12 xl:h-[70px] xl:w-[70px]" />,
    title: 'Research & Development',
  },
  {
    id: 4,
    icon: <ManagementIcon className="h-12 w-12 xl:h-[70px] xl:w-[70px]" />,
    title: 'Custom Management',
  },
  {
    id: 5,
    icon: <GlobalIcon className="h-10 w-10 xl:h-[70px] xl:w-[70px]" />,
    title: 'Global Support',
  },
];

const teamData = [
  {
    id: 1,
    image: teamThumbOne,
    name: 'Lyla Smith',
    designation: 'Chief Executive Officer',
  },
  {
    id: 2,
    image: teamThumbTwo,
    name: 'Veronica Walsh',
    designation: 'Chief Operation Officer',
  },
  {
    id: 3,
    image: teamThumbThree,
    name: 'Kamren Rolfson',
    designation: 'Senior Graphic Designer',
  },
  {
    id: 4,
    image: teamThumbFour,
    name: 'Elna Maggio',
    designation: 'User Experience Designer',
  },
  {
    id: 5,
    image: teamThumbFive,
    name: 'Winona Wisoky',
    designation: 'Motion Designer',
  },
  {
    id: 6,
    image: teamThumbSix,
    name: 'Lelia Borer',
    designation: 'Junior Video Editor',
  },
];

const AboutPage: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="About us"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.about}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col p-4 sm:p-5">
        <PageHeading title="About us" subtitle="Learn in details about us" />
        <div className="w-full space-y-8 md:space-y-10 lg:space-y-12 xl:px-20">
          <div className="block">
            <h3 className="mb-2.5 text-base font-medium text-dark dark:text-light md:text-lg">
              To help each other is human nature.
            </h3>
            <p className="leading-loose">
              Imagine, every single day from rookie to a professional graphic
              designer around the world doing their best to create an excellent
              design to help the fellow graphic designers. Here at Pixer, we
              collect and distribute the best and latest design ranging from
              fonts, mockups, graphics, template and more that are meant to be
              useful for everyone. Also, at the same time, we are gladly
              promoting awesome design of the author from various fields so you
              can find all those hard works all at once.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 md:gap-x-5 lg:grid-cols-5 lg:py-1 xl:-mx-20 xl:gap-7 xl:py-5">
            {featuredData.map((feature) => (
              <div
                className="col-span-1 text-center"
                key={`feature--key${feature.id}`}
              >
                <div className="mb-3 flex min-h-[160px] w-full items-center justify-center rounded-md bg-light-500 p-5 text-brand dark:bg-dark-400 xs:min-h-[210px] md:mb-4 lg:min-h-[175px] xl:min-h-[225px]">
                  {feature.icon}
                </div>
                <h4 className="text-sm font-medium text-dark dark:text-light md:text-15px">
                  {feature.title}
                </h4>
              </div>
            ))}
          </div>
          <div className="block">
            <h3 className="mb-2.5 text-base font-medium text-dark dark:text-light md:text-lg">
              Got something to share?
            </h3>
            <p className="leading-loose">
              We are born from the pain we had in finding great, usable imagery.
              And we weren’t alone. Which is why, today—millions of creators
              from around the world have downloaded over 2 billion assets to
              create presentations, artwork, mockups. More than 80.000+
              subscribers are waiting for your assets! Submit your assets and
              get more exposure to your works. We’d be happy to feature it on
              our site. Please use this form to do so. Pixer is a buffet of
              premium quality design resources offered for free to the
              community. Here you’ll find exclusive PSD files “cooked” in-house
              along with featured top-notch freebies from creatives around the
              world.
            </p>
          </div>
          <div className="border-y border-light-400 py-8 dark:border-dark-300 md:py-10 lg:py-12">
            <h3 className="mb-6 text-lg font-medium text-dark dark:text-light md:mb-8 lg:mb-10">
              Meet our team
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-y-10 lg:gap-x-7 lg:gap-y-12">
              {teamData.map((team) => (
                <div
                  key={`team--key${team.id}`}
                  className="flex flex-col items-center text-center lg:flex-row lg:text-left"
                >
                  <div className="relative h-[100px] w-[100px] flex-shrink-0 text-brand">
                    <Image
                      alt={team.name}
                      layout="fill"
                      quality={100}
                      objectFit="cover"
                      src={team.image ?? placeholder}
                      className="rounded-full bg-light-500 dark:bg-dark-300"
                    />
                  </div>
                  <div className="mt-3 lg:ml-5 lg:mt-0">
                    <h3 className="mb-1 text-15px font-medium text-dark dark:text-light">
                      {team.name}
                    </h3>
                    <p className="font-medium leading-[1.8em]">
                      {team.designation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="block">
            <h3 className="mb-2 text-base font-medium text-dark dark:text-light md:text-lg">
              Contact us
            </h3>
            <p className="leading-[1.75em]">
              We are always happy to chat. A good way to reach us here.{' '}
              <AnchorLink
                href={routes.contact}
                className="text-dark-100 underline hover:text-brand-dark hover:no-underline dark:text-light-600 dark:hover:text-brand"
              >
                Contact us
              </AnchorLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

AboutPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>;
};

export default AboutPage;
