import { forwardRef } from 'react';
import cn from 'classnames';

type TextareaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, className, inputClassName = 'bg-transparent', ...props },
    ref
  ) => (
    <div className={className}>
      <label className="block text-13px">
        {label && (
          <span className="pb-2.5 text-dark/70 dark:text-light/70 cursor-pointer block font-normal">
            {label}
          </span>
        )}
        <textarea
          ref={ref}
          {...props}
          className={cn(
            'appearance-none text-13px text-dark dark:text-light w-full px-4 lg:px-5 py-3 min-h-[150px] rounded border border-light-500 dark:border-dark-600 ring-[0.5px] ring-light-500 dark:ring-dark-600 focus:ring-[0.5px] focus:border-brand dark:focus:border-brand focus:ring-brand dark:focus:ring-brand',
            inputClassName
          )}
        />
      </label>
      {error && (
        <span role="alert" className="block pt-2 text-xs text-warning">
          {error}
        </span>
      )}
    </div>
  )
);

Textarea.displayName = 'Textarea';
export default Textarea;
