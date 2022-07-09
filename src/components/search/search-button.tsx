import Button from '@/components/ui/button';
import { SearchIcon } from '@/components/icons/search-icon';
import { useSearch } from '@/components/search/search-view';

export default function SearchButton({
  className = 'flex',
}: {
  className?: string;
}) {
  const { openSearch } = useSearch();
  return (
    <Button
      variant="icon"
      aria-label="Search"
      className={className}
      onClick={openSearch}
    >
      <SearchIcon className="h-5 w-5" />
    </Button>
  );
}
