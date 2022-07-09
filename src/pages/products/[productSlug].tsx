import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { useRouter } from 'next/router';
import type { NextPageWithLayout, Product } from '@/types';
import { motion } from 'framer-motion';
import Layout from '@/layouts/_layout';
import client from '@/data/client';
import Image from '@/components/ui/image';
import ProductSocialShare from '@/components/product/product-social-share';
import ProductInformation from '@/components/product/product-information';
import ProductDetailsPaper from '@/components/product/product-details-paper';
import { LongArrowIcon } from '@/components/icons/long-arrow-icon';
import { staggerTransition } from '@/lib/framer-motion/stagger-transition';
import {
  fadeInBottom,
  fadeInBottomWithScaleX,
  fadeInBottomWithScaleY,
} from '@/lib/framer-motion/fade-in-bottom';
import placeholder from '@/assets/images/placeholders/product.svg';

type ParsedQueryParams = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async () => {
  const { data } = await client.products.all();
  const paths = data.map((product) => ({
    params: { productSlug: product.slug },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

type PageProps = {
  product: Product;
};

export const getStaticProps: GetStaticProps<
  PageProps,
  ParsedQueryParams
> = async ({ params }) => {
  const { productSlug } = params!; //* we know it's required because of getStaticPaths
  try {
    const product = await client.products.get(productSlug);
    return {
      props: {
        product,
      },
      revalidate: 60, // In seconds
    };
  } catch (error) {
    //* if we get here, the product doesn't exist or something else went wrong
    return {
      notFound: true,
    };
  }
};

const ProductPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ product }) => {
  const {
    name,
    slug,
    gallery,
    description,
    created_at,
    updated_at,
    tags,
    type,
  } = product;
  const router = useRouter();
  return (
    <div className="relative">
      <div className="h-full min-h-screen p-4 md:px-6 lg:px-8 lg:pt-6">
        <div className="sticky top-0 z-20 -mx-4 -mt-2 mb-1 flex items-center bg-light-300 p-4 dark:bg-dark-100 sm:static sm:top-auto sm:z-0 sm:m-0 sm:mb-4 sm:bg-transparent sm:p-0 sm:dark:bg-transparent">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-1.5 font-medium text-dark/70 hover:text-dark dark:text-light/70 hover:dark:text-light lg:mb-6"
          >
            <LongArrowIcon className="h-4 w-4" />
            Back
          </button>
        </div>
        <motion.div
          variants={staggerTransition()}
          className="grid gap-4 sm:grid-cols-2 lg:gap-6"
        >
          {gallery?.map((img) => (
            <motion.div
              key={img.id}
              variants={fadeInBottomWithScaleX()}
              className="relative aspect-[3/2]"
            >
              <Image
                alt={name}
                layout="fill"
                quality={100}
                objectFit="cover"
                src={img?.original ?? placeholder}
                className="bg-light-500 dark:bg-dark-300"
              />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          variants={fadeInBottom()}
          className="justify-center py-6 lg:flex lg:flex-col lg:py-10"
        >
          <ProductDetailsPaper product={product} className="lg:hidden" />
          <div className="lg:mx-auto lg:flex lg:space-x-14 xl:space-x-20 3xl:max-w-[1200px] 3xl:space-x-28">
            <div className="hidden lg:block 3xl:max-w-[600px]">
              <div className="pb-5 leading-[1.9em] dark:text-light-600">
                {description}
              </div>
              <ProductSocialShare
                productSlug={slug}
                className="border-t border-light-500 pt-5 dark:border-dark-400 md:pt-7"
              />
            </div>
            <ProductInformation
              tags={tags}
              created_at={created_at}
              updated_at={updated_at}
              layoutType={type.name}
              className="flex-shrink-0 pb-6 pt-2.5 lg:min-w-[350px] lg:max-w-[470px]"
            />
          </div>
          <ProductSocialShare
            productSlug={slug}
            className="border-t border-light-500 pt-5 dark:border-dark-400 md:pt-7 lg:hidden"
          />
        </motion.div>
      </div>
      <motion.div
        variants={fadeInBottomWithScaleY()}
        className="sticky bottom-0 right-0 hidden h-[100px] w-full border-t border-light-500 bg-light-100 px-8 py-5 dark:border-dark-400 dark:bg-dark-200 lg:flex 3xl:h-[120px]"
      >
        <ProductDetailsPaper product={product} />
      </motion.div>
    </div>
  );
};

ProductPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ProductPage;
