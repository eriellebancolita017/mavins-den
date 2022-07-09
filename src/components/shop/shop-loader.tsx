import ContentLoader from 'react-content-loader';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';

export default function ShopCardLoader(props: any) {
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();
  return (
    <ContentLoader
      speed={2}
      width={'100%'}
      height={'100%'}
      viewBox="0 0 214 204"
      backgroundColor={isMounted && isDarkMode ? '#505050' : '#d0d0d0'}
      foregroundColor={isMounted && isDarkMode ? '#606060' : '#c0c0c0'}
      {...props}
    >
      <rect x="61" y="28" rx="20" ry="20" width="90" height="90" />
      <rect x="47" y="140" rx="0" ry="0" width="120" height="10" />
      <rect x="67" y="162" rx="0" ry="0" width="80" height="8" />
    </ContentLoader>
  );
}
