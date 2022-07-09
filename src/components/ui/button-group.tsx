import cn from 'classnames';
import { motion } from 'framer-motion';
import { RadioGroup } from '@headlessui/react';

type TSelectedItem = {
  label: string;
  range: number;
};

interface ButtonGroupProps {
  items: TSelectedItem[];
  selectedValue: TSelectedItem;
  onChange: React.Dispatch<React.SetStateAction<TSelectedItem>>;
}

export default function ButtonGroup({
  items,
  selectedValue,
  onChange,
}: ButtonGroupProps) {
  return (
    <RadioGroup value={selectedValue} onChange={onChange}>
      <RadioGroup.Label className="sr-only">Button Group</RadioGroup.Label>
      <div className="inline-flex shrink-0 rounded-3xl bg-light p-[5px] dark:bg-dark-300 xs:flex">
        {items.map((item) => (
          <RadioGroup.Option
            key={item.label}
            value={item}
            className="outline-none"
          >
            {({ checked }) => (
              <div className="relative z-[1] cursor-pointer rounded-3xl px-3 py-2 text-xs font-medium capitalize">
                <RadioGroup.Label
                  className={cn(
                    'cursor-pointer',
                    checked
                      ? 'text-dark'
                      : 'text-dark-700 hover:text-dark dark:text-light-800 dark:hover:text-light'
                  )}
                >
                  {item.label}
                </RadioGroup.Label>
                {checked && (
                  <motion.div
                    className="absolute left-0 right-0 bottom-0 -z-[1] h-full rounded-3xl bg-light-400 dark:bg-light-100"
                    layoutId="activeIndicator"
                  />
                )}
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
