import classNames from 'classnames';

function Paper({
  className,
  ...props
}: React.PropsWithChildren<React.DetailsHTMLAttributes<HTMLDivElement>>) {
  return <div className={classNames(className, 'relative')} {...props} />;
}

export default Paper;
