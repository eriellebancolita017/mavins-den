import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import routes from '@/config/routes';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from 'react-share';
import { LinkIcon } from '@/components/icons/link-icon';
import classNames from 'classnames';

interface Props {
  productSlug: string;
  className?: string;
}

export default function ProductSocialShare({ productSlug, className }: Props) {
  const productUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}${routes.productUrl(
    productSlug
  )}`;
  let [copyButtonStatus, setCopyButtonStatus] = useState('Copy link');
  let [_, copyToClipboard] = useCopyToClipboard();
  const handleCopyToClipboard = () => {
    copyToClipboard(productUrl);
    setCopyButtonStatus('Copied...');
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 1000);
  };
  return (
    <div className={classNames('flex text-13px lg:items-center', className)}>
      <div className="flex-shrink-0 pt-2 pr-4 dark:text-light-600 sm:w-36 lg:pt-0">
        Share this item:
      </div>
      <div className="flex flex-wrap gap-2 md:gap-3">
        <div className="product-share flex flex-shrink-0 flex-wrap items-center gap-1.5 md:gap-2.5 xl:gap-3">
          <FacebookShareButton url={productUrl}>
            <FacebookIcon
              round
              className="text-md h-9 w-9 transition-all xl:h-10 xl:w-10"
            />
          </FacebookShareButton>
          <TwitterShareButton url={productUrl}>
            <TwitterIcon
              round
              className="text-md h-9 w-9 transition-all xl:h-10 xl:w-10"
            />
          </TwitterShareButton>
          <LinkedinShareButton url={productUrl}>
            <LinkedinIcon
              round
              className="text-md h-9 w-9 transition-all xl:h-10 xl:w-10"
            />
          </LinkedinShareButton>
        </div>
        <button
          className="flex h-9 flex-shrink-0 items-center rounded-full border border-light-600 px-3 text-dark-600 hover:bg-light-200 hover:text-dark dark:border-dark-500 dark:text-light-600 hover:dark:bg-dark-500 dark:hover:text-light md:px-4 xl:h-10"
          onClick={handleCopyToClipboard}
        >
          <LinkIcon className="mr-1.5 h-3.5 w-3.5 text-dark-700 dark:text-light lg:h-4 lg:w-4" />
          <span>{copyButtonStatus}</span>
        </button>
      </div>
    </div>
  );
}
