import { forwardRef } from 'react';
import cn from 'classnames';
import { SpinnerIcon } from '@/components/icons/spinner-icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: 'text' | 'outline' | 'solid' | 'icon' | 'solidDanger';
}

const variantClasses = {
  text: 'text-dark dark:text-light',
  outline:
    'min-h-[46px] sm:h-12 rounded py-3 px-4 md:px-5 bg-transparent border border-light-500 dark:border-dark-600 text-dark dark:text-light hover:bg-light-400 focus:bg-light-500 dark:hover:bg-dark-600 dark:focus:bg-dark-600',
  solid:
    'min-h-[46px] sm:h-12 rounded py-3 px-4 md:px-5 bg-brand text-white hover:bg-brand-dark focus:bg-brand-dark',
  icon: 'transition-colors duration-200 text-dark-800 hover:text-dark-900 dark:hover:text-light-600',
  solidDanger:
    'min-h-[46px] sm:h-12 rounded py-3 px-4 md:px-5 bg-red-500 text-white hover:bg-red-600 focus:bg-red-600',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, isLoading, disabled, children, variant = 'solid', ...props },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        'transition-fill-colors flex items-center justify-center gap-2 font-semibold duration-200',
        isLoading || disabled
          ? 'pointer-events-none cursor-not-allowed'
          : 'pointer-events-auto cursor-pointer',
        disabled ? 'opacity-70' : 'opacity-100',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {isLoading && <SpinnerIcon className="h-auto w-5 animate-spin" />}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
export default Button;
