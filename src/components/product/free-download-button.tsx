import { useMutation, useQueryClient } from 'react-query';
import cn from 'classnames';
import client from '@/data/client';
import Button from '@/components/ui/button';
import { useState } from 'react';
import { API_ENDPOINTS } from '@/data/client/endpoints';

interface Props {
  productId: string;
  productSlug: string;
  productName: string;
  className?: string;
}

export default function FreeDownloadButton({
  productId,
  productSlug,
  productName,
  className,
}: Props) {
  let [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(client.products.download, {
    onSuccess: (data) => {
      function download(fileUrl: string, fileName: string) {
        var a = document.createElement('a');
        a.href = fileUrl;
        a.setAttribute('download', fileName);
        a.click();
      }
      download(data, productName);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 800);
    },
    onSettled: () => {
      queryClient.invalidateQueries([API_ENDPOINTS.PRODUCTS, productSlug]);
    },
  });
  return (
    <Button
      onClick={() => mutate({ product_id: productId })}
      isLoading={isLoading}
      className={cn(
        'relative',
        success
          ? 'is-carting pointer-events-none cursor-not-allowed'
          : 'pointer-events-auto cursor-pointer',
        className
      )}
    >
      Download
      {/* <DownloadIcon className="h-auto w-4" /> */}
      <svg
        viewBox="0 0 37 37"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-auto bottom-auto right-3 h-auto w-5 xs:right-4 xs:w-6"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2.3"
          d="M30.5 6.5h0c6.6 6.6 6.6 17.4 0 24h0c-6.6 6.6-17.4 6.6-24 0h0c-6.6-6.6-6.6-17.4 0-24h0c6.6-6.7 17.4-6.7 24 0z"
          className="circle path"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2.3"
          d="M11.6 20L15.9 24.2 26.4 13.8"
          className="tick path"
        />
      </svg>
    </Button>
  );
}
