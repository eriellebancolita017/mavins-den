import { forwardRef } from 'react';
import classNames from 'classnames';

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label: string;
  error?: string;
  className?: string;
  inputClassName?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      type = 'text',
      className,
      inputClassName = 'bg-transparent',
      ...props
    },
    ref
  ) => (
    <div className={className}>
      <label className="block text-13px">
        {label && (
          <span className="pb-2.5 text-dark/70 dark:text-light/70 cursor-pointer block font-normal">
            {label}
          </span>
        )}
        <input
          type={type}
          ref={ref}
          {...props}
          className={classNames(
            'appearance-none text-13px text-dark dark:text-light w-full px-4 lg:px-5 py-2 h-11 md:h-12 xl:h-[50px] rounded bg-transparent border border-light-500 dark:border-dark-600 ring-[0.5px] ring-light-500 dark:ring-dark-600 focus:ring-[0.5px] focus:border-brand dark:focus:border-brand focus:ring-brand dark:focus:ring-brand',
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

Input.displayName = 'Input';
export default Input;
