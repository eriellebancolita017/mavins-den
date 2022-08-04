import type { NextPageWithLayout, OrderedFile } from '@/types';
import dayjs from 'dayjs';
import { useMutation } from 'react-query';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/_dashboard';
import Image from '@/components/ui/image';
import { useDownloadableProductOrders, useOrderList } from '@/data/order';
import { DownloadIcon } from '@/components/icons/download-icon';
import client from '@/data/client';
import CartEmpty from '@/components/cart/cart-empty';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import rangeMap from '@/lib/range-map';
import Button from '@/components/ui/button';
import placeholder from '@/assets/images/placeholders/product.svg';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import { useUserContext } from '@/components/preppers/context';
import classNames from 'classnames';

function OrderedItem({ item }: { item: any }) {
  const { name, cover_photo, logo, restaurent_id, status } = item ?? {};
  // const { mutate } = useMutation(client.orders.generateDownloadLink, {
  //   onSuccess: (data) => {
  //     function download(fileUrl: string, fileName: string) {
  //       var a = document.createElement('a');
  //       a.href = fileUrl;
  //       a.setAttribute('download', fileName);
  //       a.click();
  //     }
  //     download(data, name);
  //   },
  // });
  return (
    <div className="flex items-start gap-4 border-b border-light-400 py-4 last:border-b-0 dark:border-dark-400 sm:gap-5">
      <div className="relative aspect-[5/3.4] w-28 flex-shrink-0 border border-light-300 dark:border-0 sm:w-32 md:w-36">
        <Image
          alt={name}
          layout="fill"
          quality={100}
          objectFit="cover"
          src={cover_photo ?? placeholder}
          className="bg-light-400 dark:bg-dark-400"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-0">
        <div className="flex flex-col justify-between border-b border-light-400 pb-3 dark:border-dark-600 sm:border-b-0 sm:pb-0">
          {/* <h3 className="my-1.5 font-medium text-dark dark:text-light sm:mb-3">
            {name}
          </h3> */}
          <div className="flex items-center justify-between pt-3.5">
            <div className="relative flex h-10 w-10 flex-shrink-0 4xl:h-9 4xl:w-9">
              <Image
                alt={name}
                layout="fill"
                quality={100}
                objectFit="contain"
                src={logo || placeholder}
                className="rounded-full bg-light-500 dark:bg-dark-400"
              />
            </div>
            <div className="-mt-[1px] mr-auto flex flex-col truncate pl-2.5">
              <AnchorLink
                href={routes.prepperUrl(restaurent_id!)}
                className="font-medium text-light-base hover:text-brand dark:text-dark-800 dark:hover:text-brand"
              >
                {/* <p dangerouslySetInnerHTML={{ __html: description }} className="truncate"></p> */}
                {name}
              </AnchorLink>
            </div>
          </div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            {/* Order placed on {dayjs(item.created_at).format('MMM D, YYYY')} */}
            Order placed on {item.created_at}
          </p>
          {/* {preview_url && (
            <a
              href={preview_url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-dark dark:text-brand"
            >
              Preview
            </a>
          )} */}
        </div>
        <p
          className={classNames(
            'self-end rounded-full py-1 px-2 text-xs uppercase',
            status === 'canceled'
              ? 'bg-red'
              : status === 'cancelled'
              ? 'bg-red-200 text-red-700'
              : status === 'delivered'
              ? ' bg-green-300 text-green-700'
              : status === 'picked_up'
              ? ' bg-sky-300 text-sky-700'
              : ''
          )}
          onClick={() => {}}
        >
          {status}
        </p>
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
  const { userInfo } = useUserContext();
  const { orders, isLoading } = useOrderList({
    request_type: 'past',
    // consumer_id: 'CON1644746337JTW12380',
    consumer_id: userInfo.consumer_id,
    code: 'EN',
  });
  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-full flex-grow flex-col"
    >
      <h1 className="mb-3 text-15px font-medium text-dark dark:text-light">
        My Past Orders{' '}
        <span className="ml-1 text-light-900">({orders.length})</span>
      </h1>

      {isLoading &&
        !orders.length &&
        rangeMap(LIMIT, (i) => <OrderItemLoader key={`order-loader-${i}`} />)}

      {!isLoading && !orders.length ? (
        <CartEmpty
          className="my-auto"
          description="Please purchase your product"
        />
      ) : (
        orders.map((order: any) => (
          <OrderedItem key={order.order_id} item={order} />
        ))
      )}
    </motion.div>
  );
};

Purchases.authorization = true;
Purchases.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Purchases;
