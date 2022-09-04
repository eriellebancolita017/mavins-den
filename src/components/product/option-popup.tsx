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

  const handleOptionQtyUpdate = (
    increase: Boolean,
    option_id: string,
    item_option_category_id: string
  ) => {
    let qty = checkedList[item_option_category_id as keyof object]
      ? checkedList[item_option_category_id as keyof object][option_id]['qty']
      : 0;

    if (increase) {
      qty = qty + 1;
    } else {
      if (qty > 1) {
        qty = qty - 1;
      }
    }
    const tempList: {
      [index: string]: { [index: string]: { [index: string]: any } };
    } = {
      ...checkedList,
    };
    tempList[item_option_category_id as keyof object] =
      (tempList[item_option_category_id as keyof object] as {
        [index: string]: { [index: string]: any };
      }) || ({} as { [index: string]: { [index: string]: any } });
    tempList[item_option_category_id as keyof object][option_id]['qty'] = qty;
    console.log(tempList);
    setCheckedList(tempList);
  };

  const hadleOptionCheck = (
    opiton_id: string,
    item_option_category_id: string,
    type = 'checkbox'
  ) => {
    const tempList: {
      [index: string]: { [index: string]: { [index: string]: any } };
    } = {
      ...checkedList,
    };
    if (tempList[item_option_category_id as keyof object] == undefined) {
      tempList[item_option_category_id as keyof object] = {};
    }
    if (
      tempList[item_option_category_id as keyof object][
        opiton_id as keyof object
      ] == undefined
    ) {
      tempList[item_option_category_id as keyof object][
        opiton_id as keyof object
      ] = { selected: true, qty: 1 };
    } else {
      if (type === 'radio') {
        tempList[item_option_category_id as keyof object][opiton_id][
          'selected'
        ] =
          !tempList[item_option_category_id as keyof object][opiton_id][
            'selected'
          ];
      } else {
        // (tempList[item_option_category_id as keyof object] as { [index: string]:  { [index: string]: any }  }) || ({} as { [index: string]:  { [index: string]: any }  });
        console.log(tempList[item_option_category_id as keyof object]);
        let selected = tempList[item_option_category_id][opiton_id]['selected'];
        let selectedNow = !selected;
        tempList[item_option_category_id as keyof object][opiton_id][
          'selected'
        ] = selectedNow;
        let newQty = 0;
        if (selectedNow) {
          newQty = 1;
        }
        tempList[item_option_category_id as keyof object][opiton_id]['qty'] =
          newQty;
      }
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
          ] &&
          checkedList[options.item_option_category_id as keyof object][
            item.item_option_id
          ]['selected']
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
    let isChecked =
      checkedList[option.item_option_category_id as keyof object] !==
        undefined &&
      checkedList[option.item_option_category_id as keyof object][
        item.item_option_id
      ] !== undefined
        ? checkedList[option.item_option_category_id as keyof object][
            item.item_option_id
          ]['selected']
        : false;
    return isChecked;
  };

  const getQty = (option_id: any, cateogry_id: any) => {
    let qty = checkedList[cateogry_id as keyof object]
      ? checkedList[cateogry_id as keyof object][option_id as keyof object][
          'qty'
        ]
      : 0;
    return qty;
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
                                <div className="m-1 flex flex-row items-center py-1">
                                  <Button
                                    className="text-lg"
                                    onClick={() =>
                                      handleOptionQtyUpdate(
                                        true,
                                        item.item_option_id,
                                        option.item_option_category_id
                                      )
                                    }
                                  >
                                    <span>+</span>
                                  </Button>
                                  <h2 className="px-5">
                                    {getQty(
                                      item.item_option_id,
                                      option.item_option_category_id
                                    )}
                                  </h2>
                                  <Button
                                    className="text-lg"
                                    onClick={() =>
                                      handleOptionQtyUpdate(
                                        false,
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
