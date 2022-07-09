import { useState } from 'react';
import dynamic from 'next/dynamic';
import cn from 'classnames';
import { motion } from 'framer-motion';
import Header from '@/layouts/_header';
import { Sidebar } from '@/layouts/_layout-sidebar';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
const BottomNavigation = dynamic(() => import('@/layouts/_bottom-navigation'), {
  ssr: false,
});

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const breakpoint = useBreakpoint();
  const isMounted = useIsMounted();
  let [collapse, setCollapse] = useState(false);
  function toggleSidebar() {
    setCollapse((prev) => !prev);
  }
  return (
    <motion.div
      initial="exit"
      animate="enter"
      exit="exit"
      className="flex min-h-screen w-full flex-col bg-light-300 dark:bg-dark-100"
    >
      <Header
        isCollapse={collapse}
        showHamburger={true}
        onClickHamburger={toggleSidebar}
      />
      <div className="flex flex-1">
        <Sidebar isCollapse={collapse} />
        <main
          className={cn(
            'flex w-full flex-col',
            collapse ? 'sm:pl-60 xl:pl-[75px]' : 'sm:pl-[75px] xl:pl-60'
          )}
        >
          {children}
        </main>
      </div>
      {isMounted && breakpoint === 'xs' && <BottomNavigation />}
    </motion.div>
  );
}
