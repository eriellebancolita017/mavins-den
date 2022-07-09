import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Listbox, Transition } from '@headlessui/react';
import routes from '@/config/routes';
import ActiveLink from '@/components/ui/links/active-link';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';

const menuItems = [
  {
    label: 'Help',
    path: routes.help,
  },
  {
    label: 'Licensing Agreement',
    path: routes.licensing,
  },
  {
    label: 'Terms & Conditions',
    path: routes.terms,
  },
  {
    label: 'Privacy Policy',
    path: routes.privacy,
  },
];

function SidebarNav() {
  return (
    <nav className="hidden pt-4 text-13px md:flex lg:flex-col">
      {menuItems.map((item) => (
        <ActiveLink
          key={item.label}
          href={item.path}
          className="relative flex items-center gap-3 px-4 py-5 before:absolute before:left-0 before:-bottom-[1px] before:block before:h-[1px] before:w-full before:rounded-full before:bg-brand before:opacity-0 before:transition-opacity hover:text-dark focus:text-dark dark:hover:text-light dark:focus:text-light lg:bottom-auto lg:py-3.5 lg:pl-12 lg:pr-8 lg:before:left-7 lg:before:top-1/2 lg:before:h-1.5 lg:before:w-1.5 lg:before:-translate-y-0.5"
          activeClassName="text-dark dark:text-light font-medium before:opacity-100"
        >
          {item.label}
        </ActiveLink>
      ))}
    </nav>
  );
}

function SidebarMobileNav() {
  const { pathname } = useRouter();
  const currentPath = menuItems.findIndex((item) => item.path === pathname);
  let [selected, setSelected] = useState(menuItems[currentPath]);
  useEffect(() => {
    setSelected(menuItems[currentPath]);
  }, [currentPath]);
  return (
    <nav className="mb-6 flex flex-col sm:mb-8 md:hidden">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className="group flex w-full items-center justify-between rounded-md border border-light-500 py-[11px] px-4 text-13px font-medium text-dark ring-[0.5px] ring-light-500 dark:border-dark-600 dark:text-light dark:ring-dark-600 sm:py-3 sm:px-5 sm:text-sm md:py-3.5">
            <span className="flex items-center gap-2.5 truncate sm:gap-3">
              {selected?.label}
            </span>
            <span className="pointer-events-none text-light-base group-hover:text-dark dark:text-dark-base dark:group-hover:text-light">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[17px] w-[17px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-light pt-1 pb-2 text-base shadow-dropdown dark:bg-dark-100">
              {menuItems.map((item, itemIdx) => (
                <Listbox.Option key={itemIdx} value={item}>
                  <ActiveLink
                    href={item.path}
                    className="flex items-center gap-2.5 px-4 py-2 text-13px hover:text-dark focus:text-dark dark:hover:text-light dark:focus:text-light sm:px-5 sm:py-3 sm:text-sm md:py-3.5"
                    activeClassName="text-dark dark:text-light font-medium bg-light-400 dark:bg-dark-300"
                  >
                    {item.label}
                  </ActiveLink>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </nav>
  );
}

export default function GeneralContainer({
  children,
}: React.PropsWithChildren<{}>) {
  const breakpoint = useBreakpoint();
  const isMounted = useIsMounted();
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-md bg-light p-4 shadow-card dark:bg-dark-200 dark:shadow-none xs:p-5 md:p-8 lg:flex-row lg:p-0">
      <aside className="shrink-0 justify-center border-light-300 dark:border-dark-400 md:flex md:border-b lg:block lg:w-72 lg:border-b-0 lg:border-r lg:dark:border-dark-300 lg:dark:bg-dark-250 xl:w-80">
        {isMounted && ['xs', 'sm'].indexOf(breakpoint) !== -1 ? (
          <SidebarMobileNav />
        ) : (
          <SidebarNav />
        )}
      </aside>
      <motion.div
        variants={fadeInBottom()}
        className="w-full flex-grow pt-4 pb-4 sm:pb-2 md:pt-10 lg:p-10 xl:p-12"
      >
        {children}
      </motion.div>
    </div>
  );
}
