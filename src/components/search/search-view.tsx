import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { atom, useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { useLockBodyScroll } from '@/lib/hooks/use-lock-body-scroll';
import { CloseIcon } from '@/components/icons/close-icon';
import SearchResults from '@/components/search/search-results';
import { fadeInOut } from '@/lib/framer-motion/fade-in-out';
import Button from '@/components/ui/button';

const searchAtom = atom(false);
export function useSearch() {
  const [isOpen, setIsOpen] = useAtom(searchAtom);
  function openSearch() {
    setIsOpen(true);
  }
  function closeSearch() {
    setIsOpen(false);
  }
  return {
    isOpen,
    openSearch,
    closeSearch,
  };
}

export default function SearchView() {
  const router = useRouter();
  let [searchText, setSearchText] = useState('');
  const { isOpen, closeSearch } = useSearch();
  useLockBodyScroll(isOpen);
  useEffect(() => {
    // close search modal when route change
    router.events.on('routeChangeStart', closeSearch);
    return () => {
      router.events.off('routeChangeStart', closeSearch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="exit"
          animate="enter"
          exit="exit"
          variants={fadeInOut()}
          className="search-container fixed inset-0 z-50 h-full w-full overflow-auto bg-light-200 p-5 py-0 dark:bg-dark-250 sm:px-6 md:px-8 lg:px-10 xl:px-12 3xl:px-14"
        >
          <div className="search-header sticky top-0 z-20 -mx-0.5 mb-3 border-b border-light-500/80 bg-light-200 pb-1.5 pt-10 dark:border-dark-500 dark:bg-dark-250 sm:pt-12 sm:pb-2 md:pb-3 xl:pt-14 3xl:pb-5">
            <div className="relative">
              <input
                type="text"
                autoFocus={true}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type anything to search..."
                className="w-full border-0 bg-transparent px-1 text-base text-dark outline-none focus:ring-0 dark:text-light md:text-lg lg:text-xl 3xl:text-[22px] 4xl:text-2xl"
              />
              {searchText && (
                <Button
                  variant="text"
                  onClick={() => setSearchText('')}
                  className="absolute right-0 top-1/2 -mt-2 px-1 font-normal opacity-70 hover:opacity-100"
                >
                  Clear
                </Button>
              )}
            </div>
            <button
              type="button"
              className="absolute top-5 right-0 -m-2 p-2 text-dark-900 outline-none transition-all hover:text-dark dark:text-dark-800 hover:dark:text-light-200 xl:top-6"
              onClick={closeSearch}
            >
              <span className="sr-only">Close Search</span>
              <CloseIcon className="h-4 w-4 sm:h-5 sm:w-5 3xl:h-6 3xl:w-6" />
            </button>
          </div>
          <div className="search-results -mx-4 flex min-h-[84%] flex-col md:-mx-6 lg:-mx-7 lg:py-2 3xl:-mx-8">
            <SearchResults searchText={searchText} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
