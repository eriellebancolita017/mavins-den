import cn from 'classnames';
import { ErrorFileIcon } from '@/components/icons/error-file-icon';

interface Props {
  title: string;
  message: string;
  className?: string;
}

export default function ItemNotFound({ title, message, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-grow flex-col items-center justify-center',
        className
      )}
    >
      <div className="text-center">
        <ErrorFileIcon className="mx-auto mb-6 h-auto w-20 text-light dark:text-light/10 2xl:w-24 3xl:w-32" />
        <h2 className="mb-1.5 text-15px font-semibold text-dark-300 dark:text-light">
          {title}
        </h2>
        <p className="text-dark-base dark:text-dark-800">{message}</p>
      </div>
    </div>
  );
}
