import { useProducts } from '@/data/product';
import Grid from '@/components/product/grid';

export default function SearchResults({ searchText }: { searchText: string }) {
  const { products, loadMore, hasNextPage, isLoadingMore, isLoading } =
    useProducts(
      {
        name: searchText,
      }
      // {
      //   enabled: Boolean(searchText),
      // }
    );
  return (
    <Grid
      products={products}
      onLoadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoadingMore={isLoadingMore}
      isLoading={isLoading}
    />
  );
}
