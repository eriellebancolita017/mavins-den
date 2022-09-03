import { useModalState } from '@/components/modal-views/context';
import AddToCart from '@/components/cart/add-to-cart';
import { useState } from 'react';
import CheckBox from '@/components/ui/forms/checkbox';
import RadioButton from '../ui/forms/radio-button';
import Button from '../ui/button';

export default function ProductPopupDetails() {
  const { data } = useModalState();
  const [checkedList, setCheckedList] = useState<object>({});

  // const { product, isLoading } = useProduct(data.slug);
  const bundle = data.bundle;

  // if (!bundle && isLoading) return <ProductPopupLoader />;
  if (!bundle) return <div>Not found</div>;
  const { title, item_options } = bundle ?? {};
  const currency = bundle.currency || '£';

  const hadleOptionCheck = (
    opiton_id: string,
    item_option_category_id: string,
    type = 'checkbox'
  ) => {
    const tempList: { [index: string]: { [index: string]: boolean } } = {
      ...checkedList,
    };

    if (type === 'radio') {
      tempList[item_option_category_id as keyof object] = {} as {
        [index: string]: boolean;
      };
      tempList[item_option_category_id as keyof object][opiton_id] =
        !tempList[item_option_category_id as keyof object][opiton_id];
    } else {
      tempList[item_option_category_id as keyof object] =
        (tempList[item_option_category_id as keyof object] as {
          [index: string]: boolean;
        }) || ({} as { [index: string]: boolean });
      tempList[item_option_category_id as keyof object][opiton_id] =
        !tempList[item_option_category_id as keyof object][opiton_id];
    }

    console.log(tempList);
    setCheckedList(tempList);
  };

  const getCheckedOptions = () => {
    let list = [] as any[];
    item_options!.map((options: any) => {
      options.item_option_list.map((item: any) => {
        if (
          checkedList[options.item_option_category_id as keyof object] &&
          checkedList[options.item_option_category_id as keyof object][
            item.item_option_id
          ]
        ) {
          if (
            !!list.find(
              (l) =>
                l.item_option_category_id === options.item_option_category_id
            )
          ) {
            list
              .find(
                (l) =>
                  l.item_option_category_id === options.item_option_category_id
              )
              .item_option_list.push(item);
          } else {
            list.push({
              ...options,
              item_option_list: [item],
            });
          }
        }
      });
    });

    return list;
  };

  const isChecked = (option: any, item: any) => {
    let isChecked = checkedList[option.item_option_category_id as keyof object]
      ? checkedList[option.item_option_category_id as keyof object][
          item.item_option_id
        ]
      : false;
    return isChecked;
  };

  return (
    <div className="flex max-w-full flex-col bg-light text-left dark:bg-dark-250 xs:max-w-[430px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[960px] xl:max-w-[1200px] 3xl:max-w-[1460px]">
      <div className="-mx-2.5 flex flex-wrap items-center bg-light-300 py-3 pl-4 pr-16 dark:bg-dark-100 md:py-4 md:pl-6 lg:-mx-4 lg:py-5 xl:pl-8">
        <h2
          title={title}
          className="truncate px-2.5 py-1 text-base font-medium text-dark dark:text-light md:text-lg lg:w-[400px] lg:pl-4 lg:pr-5 xl:w-[520px] 3xl:w-[555px] 3xl:text-xl"
        >
          <span className="transition-colors hover:text-brand">
            Check Options for {title}
          </span>
        </h2>
      </div>
      <div className="flex flex-col p-4 md:p-6 lg:flex-row lg:space-x-7 xl:space-x-8 xl:p-8 3xl:space-x-10">
        <div className="flex shrink-0 flex-col justify-between text-13px lg:w-[400px] xl:w-[520px] 3xl:w-[555px]">
          <div className="pb-7 xs:pb-8 lg:pb-10">
            {item_options!.length > 0 && (
              <div className="flex flex-col space-x-6 border-light-500 dark:border-dark-500">
                <div className="flex items-center tracking-[.1px] text-dark dark:text-light">
                  Meal Options:
                </div>
                {item_options!.map((option: any) => (
                  <div key={option.item_option_category_id}>
                    <p className="my-2 text-sm font-semibold">
                      {option.title_cat}
                    </p>
                    <ul className="flex list-none flex-col items-start pl-6">
                      {option.item_option_list?.map((item: any) => (
                        <li
                          key={item.item_option_id}
                          className="my-1 inline-block"
                        >
                          {!!option.is_multi ? (
                            <div>
                              <CheckBox
                                name={item.item_option_id}
                                label={`${item.title} - ${currency}
                            ${item.price.toFixed(2)}`}
                                onChange={() =>
                                  hadleOptionCheck(
                                    item.item_option_id,
                                    option.item_option_category_id
                                  )
                                }
                                checked={isChecked(option, item)}
                                disabled={option.status !== 'active'}
                              />
                              {isChecked(option, item) ? (
                                <div className="flex flex-row">
                                  <Button
                                    onClick={() =>
                                      hadleOptionCheck(
                                        item.item_option_id,
                                        option.item_option_category_id
                                      )
                                    }
                                  >
                                    +
                                  </Button>
                                  <h3>Quantity : </h3>
                                  <h3>1</h3>
                                  <Button
                                    onClick={() =>
                                      hadleOptionCheck(
                                        item.item_option_id,
                                        option.item_option_category_id
                                      )
                                    }
                                  >
                                    -
                                  </Button>
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <RadioButton
                              name={option.item_option_category_id}
                              label={`${item.title} - ${currency}
                            ${item.price.toFixed(2)}`}
                              onChange={() =>
                                hadleOptionCheck(
                                  item.item_option_id,
                                  option.item_option_category_id,
                                  'radio'
                                )
                              }
                              checked={isChecked(option, item)}
                              disabled={option.status !== 'active'}
                            />
                          )}
                          {/* {item.title} - {currency}
                          {item.price} */}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col-reverse items-center gap-3 xs:flex-row-reverse xs:gap-2.5 xs:pb-4 md:flex-nowrap md:gap-3.5 lg:gap-4 3xl:pb-14">
            <AddToCart
              item={{
                ...bundle,
                item_options: getCheckedOptions(),
                currency: bundle.currency || '£',
              }}
              toastClassName="-mt-10 xs:mt-0"
              className="mt-2.5 w-full flex-1 xs:mt-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
