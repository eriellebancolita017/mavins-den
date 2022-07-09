import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/layouts/_header';
import Sidebar from '@/layouts/_dashboard-sidebar';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
const BottomNavigation = dynamic(() => import('@/layouts/_bottom-navigation'));

export default function DashboardLayout({
  children,
}: React.PropsWithChildren<{}>) {
  const breakpoint = useBreakpoint();
  const isMounted = useIsMounted();
  return (
    <motion.div
      initial="exit"
      animate="enter"
      exit="exit"
      className="flex min-h-full flex-col bg-light dark:bg-dark-100 lg:min-h-[auto] lg:bg-light-300"
    >
      <Header />
      <motion.div
        variants={fadeInBottom()}
        className="mx-auto my-6 w-full max-w-screen-xl flex-1 px-4 sm:my-8 sm:px-5 md:my-10 xl:my-12 3xl:my-14"
      >
        <div className="flex w-full flex-col rounded-lg lg:min-h-[70vh] lg:flex-row lg:shadow-card 2xl:min-h-[630px]">
          <Sidebar />
          <main className="flex w-full flex-grow flex-col lg:flex-grow-0 lg:bg-light lg:py-8 lg:px-12 lg:dark:bg-dark-250">
            <AnimatePresence
              exitBeforeEnter
              initial={false}
              onExitComplete={() => window.scrollTo(0, 0)}
            >
              {children}
            </AnimatePresence>
          </main>
        </div>
      </motion.div>
      {isMounted && breakpoint === 'xs' && <BottomNavigation />}
    </motion.div>
  );
}
