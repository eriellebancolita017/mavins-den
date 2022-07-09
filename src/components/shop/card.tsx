import type { Shop } from '@/types';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Image from '@/components/ui/image';
import routes from '@/config/routes';
import placeholder from '@/assets/images/placeholders/product.svg';
import { fadeInBottomWithScaleX } from '@/lib/framer-motion/fade-in-bottom';

export default function Card({ shop }: { shop: Shop }) {
  const { name, slug, logo, products_count } = shop ?? {};
  const router = useRouter();
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.05 }}
      variants={fadeInBottomWithScaleX()}
      onClick={() => router.push(routes.shopUrl(slug))}
      className="group cursor-pointer rounded-md bg-light px-4 py-7 text-center dark:bg-dark-250"
    >
      <div className="relative mx-auto mb-2.5 h-[75px] w-[75px] md:h-20 md:w-20 lg:h-[90px] lg:w-[90px]">
        <Image
          alt={name}
          layout="fill"
          quality={100}
          objectFit="cover"
          src={logo?.original ?? placeholder}
          className="rounded-3xl"
        />
      </div>
      <h3 className="mb-1 text-13px font-medium text-dark transition-colors group-hover:text-brand dark:text-light">
        {name}
      </h3>
      <div className="font-medium text-dark-800 dark:text-dark-base">
        {products_count} Products
      </div>
    </motion.div>
  );
}
