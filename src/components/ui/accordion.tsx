import { Disclosure, Transition } from '@headlessui/react';
import { ChevronRight } from '@/components/icons/chevron-right';

type CollapseProps = {
  item: any;
};

export const Accordion: React.FC<CollapseProps> = ({ item }) => {
  const { title, content } = item;
  return (
    <div className="w-full mx-auto mb-4 rounded shadow-category group">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`rounded relative flex justify-between w-full px-5 py-4 sm:py-5 border text-left text-dark dark:text-light focus:outline-none border-light-400 dark:border-dark-400 ${
                open
                  ? 'bg-light-200 dark:bg-dark-300'
                  : 'bg-light dark:bg-dark-200'
              }`}
            >
              <span className="text-sm font-medium">{title}</span>
              <ChevronRight
                className={`w-4 sm:w-[18px] h-4 sm:h-[18px] text-dark/60 group-hover:text-dark dark:text-light/70 dark:group-hover:text-light -mr-2 lg:-mr-1.5 mt-0.5 flex-shrink-0 transition-all ${
                  open ? 'rotate-90' : ''
                }`}
              />
            </Disclosure.Button>

            <Transition
              show={open}
              enter="transition duration-500 ease-out"
              enterFrom="transform scale-5 opacity-0"
              enterTo="transform scale-10 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-5 opacity-0"
            >
              {open && (
                <Disclosure.Panel static>
                  <div className="px-5 py-3 leading-7 3xl:pt-5 3xl:px-6">
                    {content}
                  </div>
                </Disclosure.Panel>
              )}
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default Accordion;
