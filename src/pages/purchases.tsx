import type { NextPageWithLayout, OrderedFile } from '@/types';
import dayjs from 'dayjs';
import { useMutation } from 'react-query';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/_dashboard';
import Image from '@/components/ui/image';
import { useDownloadableProductOrders } from '@/data/order';
import { DownloadIcon } from '@/components/icons/download-icon';
import client from '@/data/client';
import CartEmpty from '@/components/cart/cart-empty';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import rangeMap from '@/lib/range-map';
import Button from '@/components/ui/button';
import placeholder from '@/assets/images/placeholders/product.svg';

function OrderedItem({ item }: { item: OrderedFile }) {
  const { name, image, preview_url } = item.file.fileable ?? {};
  const { mutate } = useMutation(client.orders.generateDownloadLink, {
    onSuccess: (data) => {
      function download(fileUrl: string, fileName: string) {
        var a = document.createElement('a');
        a.href = fileUrl;
        a.setAttribute('download', fileName);
        a.click();
      }
      download(data, name);
    },
  });
  return (
    <div className="flex items-start gap-4 border-b border-light-400 py-4 last:border-b-0 dark:border-dark-400 sm:gap-5">
      <div className="relative aspect-[5/3.4] w-28 flex-shrink-0 border border-light-300 dark:border-0 sm:w-32 md:w-36">
        <Image
          alt={name}
          layout="fill"
          quality={100}
          objectFit="cover"
          src={image?.thumbnail ?? placeholder}
          className="bg-light-400 dark:bg-dark-400"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-0">
        <div className="border-b border-light-400 pb-3 dark:border-dark-600 sm:border-b-0 sm:pb-0">
          <p className="text-gray-500 dark:text-gray-400">
            Purchased on {dayjs(item.updated_at).format('MMM D, YYYY')}
          </p>
          <h3 className="my-1.5 font-medium text-dark dark:text-light sm:mb-3">
            {name}
          </h3>
          {preview_url && (
            <a
              href={preview_url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-dark dark:text-brand"
            >
              Preview
            </a>
          )}
        </div>
        <button
          className="flex items-center gap-2 font-semibold text-brand hover:text-brand-dark sm:h-12 sm:rounded sm:border sm:border-light-500 sm:bg-transparent sm:py-3 sm:px-5 sm:dark:border-dark-600"
          onClick={() => mutate(item.digital_file_id)}
        >
          <DownloadIcon className="h-auto w-4" />
          Download
        </button>
      </div>
    </div>
  );
}

function OrderItemLoader() {
  return (
    <div className="flex animate-pulse items-start gap-4 border-b border-light-400 py-4 last:border-b-0 dark:border-dark-400 sm:items-stretch sm:gap-5">
      <div className="relative aspect-[5/3.4] w-28 flex-shrink-0 bg-light-400 dark:bg-dark-400 sm:w-32 md:w-36" />
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-0">
        <div className="h-full flex-grow border-b border-light-400 pb-3 dark:border-dark-600 sm:border-b-0 sm:pb-0">
          <div className="mb-3 h-2.5 w-1/4 bg-light-400 dark:bg-dark-400" />
          <div className="mb-6 h-2.5 w-2/4 bg-light-400 dark:bg-dark-400" />
          <div className="h-2.5 w-1/5 bg-light-400 dark:bg-dark-400" />
        </div>
        <div className="h-2.5 w-1/3 bg-light-400 dark:bg-dark-400 sm:h-12 sm:w-1/4 sm:rounded md:w-1/6" />
      </div>
    </div>
  );
}

const LIMIT = 10;
const Purchases: NextPageWithLayout = () => {
  const { downloadableFiles, isLoading, isLoadingMore, hasNextPage, loadMore } =
    useDownloadableProductOrders({
      limit: LIMIT,
      orderBy: 'updated_at',
      sortedBy: 'desc',
    });
  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-full flex-grow flex-col"
    >
      <h1 className="mb-3 text-15px font-medium text-dark dark:text-light">
        My Purchase List{' '}
        <span className="ml-1 text-light-900">
          ({downloadableFiles.length})
        </span>
      </h1>

      {isLoading &&
        !downloadableFiles.length &&
        rangeMap(LIMIT, (i) => <OrderItemLoader key={`order-loader-${i}`} />)}

      {!isLoading && !downloadableFiles.length ? (
        <CartEmpty
          className="my-auto"
          description="Please purchase your product"
        />
      ) : (
        downloadableFiles.map((file) => (
          <OrderedItem key={file.id} item={file} />
        ))
      )}

      {hasNextPage && (
        <div className="mt-10 grid place-content-center">
          <Button
            onClick={loadMore}
            disabled={isLoadingMore}
            isLoading={isLoadingMore}
          >
            Load more
          </Button>
        </div>
      )}
    </motion.div>
  );
};

Purchases.authorization = true;
Purchases.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Purchases;
