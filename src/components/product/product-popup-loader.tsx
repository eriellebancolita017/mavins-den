export default function ProductPopupLoader() {
  return (
    <div className="max-w-full bg-light text-left dark:bg-dark-250 xs:w-[430px] sm:w-[550px] md:w-[600px] lg:w-[960px] xl:w-[1200px] 3xl:w-[1460px]">
      <div className="h-16 w-full bg-light-400 dark:bg-dark-100 lg:h-[70px] xl:h-20" />
      <div className="grid p-4 md:p-6 lg:grid-cols-9 lg:gap-7 xl:gap-8 xl:p-8 3xl:grid-cols-7 3xl:gap-10">
        <div className="lg:col-span-5 3xl:col-span-4">
          <div className="aspect-[3/2] w-full animate-pulse bg-light-400 dark:bg-dark-100/60" />
          <div className="grid grid-cols-4 gap-4 pt-4 sm:gap-5 sm:pt-5">
            <span className="aspect-[3/2] w-full animate-pulse bg-light-400 dark:bg-dark-100/60" />
            <span className="aspect-[3/2] w-full animate-pulse bg-light-400 dark:bg-dark-100/60" />
            <span className="aspect-[3/2] w-full animate-pulse bg-light-400 dark:bg-dark-100/60" />
            <span className="aspect-[3/2] w-full animate-pulse bg-light-400 dark:bg-dark-100/60" />
          </div>
        </div>
        <div className="flex h-full flex-col pt-6 sm:pt-10 lg:col-span-4 lg:pt-0 3xl:col-span-3">
          <div>
            <div className="grid gap-4 pb-8 3xl:pb-10">
              <span className="h-3 w-[90%] animate-pulse bg-light-400 dark:bg-dark-100/60" />
              <span className="h-3 w-full animate-pulse bg-light-400 dark:bg-dark-100/60" />
              <span className="h-3 w-[94%] animate-pulse bg-light-400 dark:bg-dark-100/60" />
              <span className="h-3 w-[54%] animate-pulse bg-light-400 dark:bg-dark-100/60" />
            </div>
            <div className="flex gap-6 border-y border-light-300 py-4 dark:border-dark-400 3xl:py-5">
              <span className="h-6 w-28 animate-pulse bg-light-400 dark:bg-dark-100/60" />
              <span className="h-6 w-28 animate-pulse bg-light-400 dark:bg-dark-100/60" />
            </div>
            <div className="grid gap-6 py-9 md:py-10 3xl:py-12">
              <div className="flex w-full items-start gap-7">
                <span className="h-3 w-36 flex-shrink-0 animate-pulse bg-light-400 dark:bg-dark-100/60" />
                <span className="h-3 w-3/6 animate-pulse bg-light-400 dark:bg-dark-100/60" />
              </div>
              <div className="flex w-full items-start gap-7">
                <span className="h-3 w-36 flex-shrink-0 animate-pulse bg-light-400 dark:bg-dark-100/60" />
                <span className="h-3 w-full animate-pulse bg-light-400 dark:bg-dark-100/60" />
              </div>
              <div className="flex w-full items-start gap-7">
                <span className="h-3 w-36 flex-shrink-0 animate-pulse bg-light-400 dark:bg-dark-100/60" />
                <span className="h-3 w-2/5 animate-pulse bg-light-400 dark:bg-dark-100/60" />
              </div>
              <div className="flex w-full items-start gap-7">
                <span className="h-3 w-36 flex-shrink-0 animate-pulse bg-light-400 dark:bg-dark-100/60" />
                <span className="h-3 w-3/5 animate-pulse bg-light-400 dark:bg-dark-100/60" />
              </div>
            </div>
            <div className="flex w-full items-center gap-8 border-t border-light-300 pt-4 pb-8 dark:border-dark-400 md:pt-5 md:pb-10">
              <span className="h-3 w-28 flex-shrink-0 animate-pulse bg-light-400 dark:bg-dark-100/60" />
              <div className="flex w-full items-start gap-3">
                <span className="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-light-400 dark:bg-dark-100/60" />
                <span className="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-light-400 dark:bg-dark-100/60" />
                <span className="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-light-400 dark:bg-dark-100/60" />
                <span className="h-10 animate-pulse rounded-full bg-light-400 dark:bg-dark-100/60 lg:w-1/2 xl:w-28" />
              </div>
            </div>
          </div>
          <div className="mt-auto flex flex-col-reverse items-center xs:flex-row xs:gap-2.5 xs:pb-4 md:flex-nowrap md:gap-3.5 lg:gap-4 3xl:pb-14">
            <span className="h-12 w-full animate-pulse rounded bg-light-400 dark:bg-dark-100/60" />
            <span className="h-12 w-full  animate-pulse rounded bg-light-400 dark:bg-dark-100/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
