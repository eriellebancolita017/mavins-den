import cn from 'classnames';

export default function Copyright({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  return (
    <div className={cn('tracking-[0.2px]', className)}>
      &copy; Copyright {currentYear} By{' '}
      <a
        href="https://redq.io"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-brand-dark"
      >
        RedQ, Inc
      </a>
      .
    </div>
  );
}
