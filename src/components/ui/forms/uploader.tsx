import type { Attachment } from '@/types';
import client from '@/data/client';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'react-query';
import Image from '@/components/ui/image';
import { CloseIcon } from '@/components/icons/close-icon';
import Button from '@/components/ui/button';
import { SpinnerIcon } from '@/components/icons/spinner-icon';

function getDefaultValues(attachment: Attachment[] | null) {
  if (!attachment) return null;
  return Array.isArray(attachment) ? attachment : [attachment];
}

export default function Uploader({
  onChange,
  value,
  name,
  onBlur,
  multiple = true,
}: any) {
  let [attachments, setAttachments] = useState<Attachment[] | null>(
    getDefaultValues(value)
  );
  useEffect(() => {
    setAttachments(getDefaultValues(value));
  }, [value]);

  const { mutate, isLoading } = useMutation(client.settings.upload, {
    onSuccess: (response) => {
      const data = multiple ? response : response[0];
      onChange(data);
      setAttachments(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const onDrop = useCallback(
    (acceptedFiles) => {
      mutate(acceptedFiles);
    },
    [mutate]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple,
    onDrop,
  });
  function remove(id: string) {
    if (!attachments) return;
    const newAttachments = attachments.filter(
      (attachment) => attachment.id !== id
    );
    if (!newAttachments.length) {
      setAttachments(null);
      onChange(null);
      return;
    }
    setAttachments(newAttachments);
    const data = multiple ? newAttachments : newAttachments[0];
    onChange(data);
  }
  return (
    <div
      {...getRootProps({
        className:
          'relative border-dashed border-2 border-light-500 dark:border-dark-600 h-36 text-center rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none',
      })}
    >
      <input
        {...getInputProps({
          name,
          onBlur,
        })}
      />
      {Array.isArray(attachments)
        ? attachments.map(({ id, original }) => (
            <div key={id}>
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image
                  alt="Avatar"
                  src={original}
                  layout="fill"
                  objectFit="scale-down"
                />
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(id);
                }}
                variant="icon"
                className="absolute right-0 top-0 p-3"
              >
                <CloseIcon className="h-4 w-4 3xl:h-5 3xl:w-5" />
              </Button>
            </div>
          ))
        : 'Upload Your Avatar Image (80 X 80)'}
      {isLoading && (
        <span className="mt-2.5 flex items-center gap-1 font-medium text-light-500">
          <SpinnerIcon className="h-auto w-5 animate-spin text-brand" />{' '}
          Loading...
        </span>
      )}
    </div>
  );
}
