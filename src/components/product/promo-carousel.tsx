import { Swiper, SwiperSlide, Navigation } from '@/components/ui/slider';
import Image from '@/components/ui/image';
import { ChevronLeft } from '@/components/icons/chevron-left';
import { ChevronRight } from '@/components/icons/chevron-right';
import placeholder from '@/assets/images/placeholders/product.svg';
import { siteSettings } from '@/data/static/site-settings';

const carouselBreakpoints = {
  1024: {
    slidesPerView: 2.2,
    spaceBetween: 24,
  },
};

export default function PromoCarousel() {
  const { promoCarouselImages } = siteSettings;
  return (
    <div className="relative border-b border-light-300 bg-light-100 pl-4 pt-5 dark:border-dark-300 dark:bg-dark-100 md:pl-6 md:pt-6 lg:pl-7 3xl:pl-8">
      <Swiper
        id="promoCarousel"
        speed={400}
        spaceBetween={20}
        slidesPerView={1.2}
        allowTouchMove={true}
        modules={[Navigation]}
        breakpoints={carouselBreakpoints}
        navigation={{
          nextEl: '.next',
          prevEl: '.prev',
        }}
      >
        {promoCarouselImages?.map((slideImg, index) => (
          <SwiperSlide
            key={`promo-carousel-key-${index}`}
            className="relative mb-5 aspect-[37/16] w-full  bg-light-200 dark:bg-dark-250 2xl:mb-6"
          >
            <Image
              layout="fill"
              objectFit="cover"
              alt={`promo-carousel-${index}`}
              src={slideImg ?? placeholder}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute top-2/4 left-0 z-10 flex w-full items-center justify-between pl-1 pr-4 sm:pr-6 md:pl-2.5">
        <button className="prev flex h-8 w-8 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full border border-light-400 bg-light text-dark-100 shadow-xl hover:bg-light-200 focus:outline-none dark:border-dark-400 dark:bg-dark-400 dark:text-white hover:dark:bg-dark-300 xl:h-9 xl:w-9">
          <ChevronLeft className="h-4 w-4 xl:h-[18px] xl:w-[18px]" />
        </button>
        <button className="next flex h-8 w-8 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full border border-light-400 bg-light text-dark-100 shadow-xl hover:bg-light-200 focus:outline-none dark:border-dark-400 dark:bg-dark-400 dark:text-white hover:dark:bg-dark-300 xl:h-9 xl:w-9">
          <ChevronRight className="h-4 w-4 xl:h-[18px] xl:w-[18px]" />
        </button>
      </div>
    </div>
  );
}
