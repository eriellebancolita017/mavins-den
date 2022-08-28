import type { User } from '@/types';
import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Avatar from 'react-avatar';
import routes from '@/config/routes';
import Logo from '@/components/ui/logo';
import ThemeSwitcher from '@/components/ui/theme-switcher';
import ActiveLink from '@/components/ui/links/active-link';
import { useLogout, useMe } from '@/data/user';
import { Menu } from '@/components/ui/dropdown';
import { Transition } from '@/components/ui/transition';
import { UserIcon } from '@/components/icons/user-icon';
import SearchButton from '@/components/search/search-button';
import CartButton from '@/components/cart/cart-button';
import Hamburger from '@/components/ui/hamburger';
import GridSwitcher from '@/components/product/grid-switcher';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useSwapBodyClassOnScrollDirection } from '@/lib/hooks/use-swap-body-class';
import { useModalAction } from '@/components/modal-views/context';
import Button from '@/components/ui/button';
import { useUserContext } from '@/components/preppers/context';
import toast from 'react-hot-toast';

const AuthorizedMenuItems = [
  {
    label: 'Profile',
    path: routes.profile,
  },
  {
    label: 'Purchases',
    path: routes.purchases,
  },
  {
    label: 'Password',
    path: routes.password,
  },
];

function AuthorizedMenu({ user }: { user: User }) {
  const { userInfo } = useUserContext();
  const { mutate: logout } = useLogout();
  return (
    <Menu>
      <Menu.Button className="relative inline-flex h-8 w-8 justify-center rounded-full border border-light-400 bg-light-300 dark:border-dark-500 dark:bg-dark-500">
        <Avatar
          size="32"
          round={true}
          name={user.name}
          textSizeRatio={2}
          src={user?.profile_photo}
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute top-[84%] right-0 z-30 mt-4 w-56 origin-top-right rounded-md bg-light py-1.5 text-dark shadow-dropdown dark:bg-dark-250 dark:text-light">
          {AuthorizedMenuItems.map((item) => (
            <Menu.Item key={item.label}>
              <ActiveLink
                href={item.path}
                className="transition-fill-colors flex w-full items-center px-5 py-2.5 hover:bg-light-400 dark:hover:bg-dark-600"
              >
                {item.label}
              </ActiveLink>
            </Menu.Item>
          ))}
          <Menu.Item>
            <button
              type="button"
              className="transition-fill-colors w-full px-5 py-2.5 text-left hover:bg-light-400 dark:hover:bg-dark-600"
              onClick={async () => {
                await logout({
                  user_id: userInfo.consumer_id,
                  device_token: userInfo.device_token || 'xxx',
                  code: 'EN',
                });
                toast.success(<b>Successfully Signed up.</b>, {
                  className: '-mt-10 xs:mt-0',
                });
              }}
            >
              Logout
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function LoginMenu() {
  const { openModal } = useModalAction();
  const { me, isAuthorized, isLoading } = useMe();
  const isMounted = useIsMounted();
  if (!isMounted) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-light-300 dark:bg-dark-500" />
    );
  }
  if (isAuthorized && me && !isLoading) {
    return <AuthorizedMenu user={me} />;
  }
  return (
    <Button
      variant="icon"
      aria-label="User"
      className="flex"
      onClick={() => openModal('LOGIN_VIEW')}
    >
      <UserIcon className="h-5 w-5" />
    </Button>
  );
}

interface HeaderProps {
  isCollapse?: boolean;
  showHamburger?: boolean;
  onClickHamburger?: () => void;
}

export default function Header({
  isCollapse,
  showHamburger = false,
  onClickHamburger,
}: HeaderProps) {
  const { openModal } = useModalAction();
  const { asPath } = useRouter();
  const { location } = useUserContext();
  useSwapBodyClassOnScrollDirection();
  return (
    <header className="app-header h-34 sticky top-0 left-0 z-30 flex w-full flex-col sm:h-[70px] sm:px-6">
      <div className="mx-auto max-h-16 w-full justify-between bg-brand px-4 py-2 shadow dark:border-dark-500 md:flex md:items-center md:px-8">
        <h2 className="flex flex-col items-center font-semibold text-dark-400">
          Use coupon code ‘15NOW’ at checkout for 15% off your first order.
        </h2>
      </div>
      <div className="flex items-center justify-between border-b border-light-300 bg-light py-1 px-4 dark:border-dark-300 dark:bg-dark-250">
        <div className="flex items-center gap-4">
          {showHamburger && (
            <Hamburger
              isToggle={isCollapse}
              onClick={onClickHamburger}
              className="hidden sm:flex"
            />
          )}
          <Logo />
        </div>
        <div className="relative flex items-center gap-5 pr-0.5 xs:gap-6 sm:gap-7">
          <button
            onClick={() => openModal('ADDRESS_VIEW')}
            className="relative top-1.5 flex flex-col items-center font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
          >
            Show me meal preppers that deliver to: {location.postcode} <br />
            <small className="text-dark dark:text-light">Tap to change</small>
          </button>
          {/* <SearchButton className="hidden sm:flex" /> */}
          <ThemeSwitcher />
          <GridSwitcher />
          {asPath !== routes.checkout && (
            <CartButton className="hidden sm:flex" />
          )}
          <LoginMenu />
        </div>
      </div>
    </header>
  );
}
