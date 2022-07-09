import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/layouts/_header';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import Copyright from '@/layouts/_copyright';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
const BottomNavigation = dynamic(() => import('@/layouts/_bottom-navigation'));

export default function GeneralLayout({
  children,
}: React.PropsWithChildren<{}>) {
  const breakpoint = useBreakpoint();
  const isMounted = useIsMounted();
  return (
    <motion.div
      initial="exit"
      animate="enter"
      exit="exit"
      className="flex min-h-screen w-full flex-col bg-light-300 dark:bg-dark-100"
    >
      <Header showHamburger={false} />
      <motion.div
        variants={fadeInBottom()}
        className="flex flex-1 flex-col justify-between"
      >
        <main className="flex w-full flex-grow flex-col">
          <AnimatePresence
            exitBeforeEnter
            initial={false}
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            {children}
          </AnimatePresence>
        </main>
        <Copyright className="px-4 py-7 text-center font-medium text-dark-700 md:py-10 lg:px-8" />
      </motion.div>
      {isMounted && breakpoint === 'xs' && <BottomNavigation />}
    </motion.div>
  );
}
