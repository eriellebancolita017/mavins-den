import dayjs from 'dayjs';
import { UpdateIcon } from '@/components/icons/update-icon';
import { CalenderIcon } from '@/components/icons/calendar-icon';
import { LayoutIcon } from '@/components/icons/layout-icon';
import { LabelIcon } from '@/components/icons/label-icon';
import AnchorLink from '@/components/ui/links/anchor-link';
import classNames from 'classnames';
import { Tag } from '@/types';
import routes from '@/config/routes';

interface Props {
  className?: string;
  updated_at: string;
  created_at: string;
  tags: Tag[];
  layoutType: string;
}

export default function ProductInformation({
  className,
  updated_at,
  created_at,
  tags,
  layoutType,
}: Props) {
  return (
    <div className={classNames('space-y-4 text-13px', className)}>
      <div className="flex items-start text-dark dark:text-light">
        <strong className="flex w-36 flex-shrink-0 items-center font-normal text-dark-600 dark:text-light-600">
          <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
            <UpdateIcon className="h-[18px] w-[18px]" />
          </span>
          Last Update:
        </strong>
        <span className="font-medium">
          {dayjs(updated_at).format('MMM D, YYYY')}
        </span>
      </div>
      <div className="flex items-start text-dark dark:text-light">
        <strong className="flex w-36 flex-shrink-0 items-center font-normal text-dark-600 dark:text-light-600">
          <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
            <CalenderIcon className="h-[18px] w-[18px]" />
          </span>
          Published:
        </strong>
        <span className="font-medium">
          {dayjs(created_at).format('MMM D, YYYY')}
        </span>
      </div>
      <div className="flex items-start text-dark dark:text-light">
        <strong className="flex w-36 flex-shrink-0 items-center font-normal text-dark-600 dark:text-light-600">
          <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
            <LayoutIcon className="h-[18px] w-[18px]" />
          </span>
          Layout:
        </strong>
        <span className="font-medium">{layoutType}</span>
      </div>
      {!!tags?.length && (
        <div className="flex items-start text-dark dark:text-light">
          <strong className="flex w-36 flex-shrink-0 items-center pt-0.5 font-normal text-dark-600 dark:text-light-600">
            <span className="w-8 flex-shrink-0 text-dark-900 dark:text-light-900">
              <LabelIcon className="h-5 w-5" />
            </span>
            Tags:
          </strong>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: Tag) => (
              <AnchorLink
                key={tag.id}
                href={routes.tagUrl(tag.slug)}
                className="inline-flex items-center justify-center rounded border border-light-600 px-2 py-0.5 font-medium text-light-base transition-all hover:bg-light-200 hover:text-dark-300 dark:border-dark-500 dark:text-light-600 dark:hover:bg-dark-400 hover:dark:text-light"
              >
                {tag.name}
              </AnchorLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
