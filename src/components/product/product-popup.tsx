import Image from '@/components/ui/image';
import routes from '@/config/routes';
import { useModalState } from '@/components/modal-views/context';
import AnchorLink from '@/components/ui/links/anchor-link';
import ProductSocialShare from '@/components/product/product-social-share';
import ProductInformation from '@/components/product/product-information';
import { ShoppingCartIcon } from '@/components/icons/shopping-cart-icon';
import ProductThumbnailGallery from '@/components/product/product-thumbnail-gallery';
import AddToCart from '@/components/cart/add-to-cart';
import placeholder from '@/assets/images/placeholders/product.svg';
import { isFree } from '@/lib/is-free';
import FreeDownloadButton from '@/components/product/free-download-button';
import { DownloadIcon } from '@/components/icons/download-icon';
import pluralize from 'pluralize';
import { useProduct } from '@/data/product';
import ProductPopupLoader from '@/components/product/product-popup-loader';
import { useBundleDetails } from '@/data/explore';
import Button from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/router';
import CheckBox from '@/components/ui/forms/checkbox';
import RadioButton from '../ui/forms/radio-button';
import { useCart } from '@/components/cart/lib/cart.context';
import { useQuery } from 'react-query';
import client from '@/data/client';
import { getAuthToken } from '@/data/client/token.utils';
import toast from 'react-hot-toast';

export default function ProductPopupDetails() {
  const { data } = useModalState();
  const router = useRouter();
  const [checkedList, setCheckedList] = useState<object>({});
  const { items, isEmpty, total } = useCart();
  const token = getAuthToken();

  // const { product, isLoading } = useProduct(data.slug);
  const { bundle, isLoading } = useBundleDetails({
    item_id: data.item_id,
    code: 'EN',
  });
  const id = data.item_id;
  const slug = data.item_id;

  const { isLoading: loading, data: prepper } = useQuery(
    [items],
    () =>
      client.preppers.getDetails({
        restaurant_id: items[0].restaurant_id,
        consumer_id: token!,
        latitude: 52.2880069,
        longitude: 0.0522349,
        code: 'EN',
        searchKey: '',
      }),
    {
      enabled: !isEmpty,
    }
  );

  if (!bundle && isLoading) return <ProductPopupLoader />;
  if (!bundle) return <div>Not found</div>;
  const {
    title,
    description,
    image,
    cover_photo,
    restaurant_name,
    restaurant_id,
    // updated_at,
    // created_at,
    // gallery,
    // orders_count,
    // total_downloads,
    // tags,
    // preview_url,
    // type,
    price,
    banner,
    preparation_time,
    availability_status,
    currency,
    ingredients,
    item_options,
  } = bundle ?? {};

  const gallery = banner?.map((item, index) => {
    return {
      id: index,
      original: item,
      thumbnail: item,
    };
  });

  function handleCheckout() {
    if (prepper?.payload.minimum_order_amount! <= total) {
      router.push(routes.checkout);
    } else {
      toast.error(
        <b>
          Order amount should be more than £
          {prepper?.payload.minimum_order_amount!}.
        </b>,
        {
          className: '-mt-10 xs:mt-0',
        }
      );
    }
  }

  const handleOptionQtyUpdate = (
    increase: Boolean,
    option_id: string,
    option: any,
    item_option_category_id: string
  ) => {
    let qty = checkedList[item_option_category_id as keyof object]
      ? checkedList[item_option_category_id as keyof object][option_id]['qty']
      : 0;
    if (
      increase &&
      totalMealsPicked(item_option_category_id) >= getTotalQty(option)
    ) {
      toast.success(
        <b>
          You have already picked your meals. To add a new meal, remove any one
          of the already selected meals.
        </b>,
        {
          className: '-mt-10 xs:mt-0',
        }
      );
      return;
    }

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
    if (totalMealsPicked(item_option_category_id) == getTotalQty(option)) {
      toast.success(
        <b>
          You have successfully picked your meals, click &quot;Add to
          Basket&quot; to add the meals to your basket.
        </b>,
        {
          className: '-mt-10 xs:mt-0',
        }
      );
      return;
    }
  };

  const hadleOptionCheck = (
    opiton_id: string,
    option: any,
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
      if (
        type !== 'radio' &&
        totalMealsPicked(item_option_category_id) >= getTotalQty(option)
      ) {
        toast.success(
          <b>
            You have already picked your meals. To add a new meal, unselect any
            one of the already selected meals.
          </b>,
          {
            className: '-mt-10 xs:mt-0',
          }
        );
        return;
      }

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

        if (
          selectedNow &&
          totalMealsPicked(item_option_category_id) >= getTotalQty(option)
        ) {
          toast.success(
            <b>
              You have already picked your meals. To add a new meal, unselect
              any one of the already selected meals.
            </b>,
            {
              className: '-mt-10 xs:mt-0',
            }
          );
          return;
        }
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
                l.sitem_option_category_id === options.item_option_category_id
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

  const totalMealsPicked = (cateogry_id: any) => {
    let category_options = checkedList[cateogry_id as keyof object];
    let total = 0;
    if (category_options != undefined) {
      Object.keys(category_options).forEach(function (key) {
        const option_qty = category_options[key]['qty'];
        if (option_qty != undefined) {
          total = total + option_qty;
        }
      });
    }
    return total;
  };

  const getTotalQty = (option: any) => {
    // Check if the number of meals added so far is equal to the minimum qty needed
    if (option.title_cat != undefined) {
      const re = new RegExp('([0-9]+)');
      const myArray = option.title_cat.match(re);
      if (myArray != null) {
        return myArray[0];
      }
    }
    return null;
  };

  return (
    <div className="flex max-w-full flex-col bg-light text-left dark:bg-dark-250 xs:max-w-[430px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[960px] xl:max-w-[1200px] 3xl:max-w-[1460px]">
      <div className="-mx-2.5 flex flex-wrap items-center bg-light-300 py-3 pl-4 pr-16 dark:bg-dark-100 md:py-4 md:pl-6 lg:-mx-4 lg:py-5 xl:pl-8">
        <h2
          title={title}
          className="truncate px-2.5 py-1 text-base font-medium text-dark dark:text-light md:text-lg lg:pl-4 lg:pr-5 3xl:text-xl"
        >
          <span className="transition-colors hover:text-brand">{title}</span>
        </h2>
        <div className="flex flex-shrink-0 items-center px-2.5 py-1">
          <div className="relative flex h-5 w-5 flex-shrink-0 md:h-6 md:w-6">
            <Image
              alt={restaurant_name}
              layout="fill"
              quality={100}
              objectFit="cover"
              src={image || placeholder}
              className="rounded-full"
            />
          </div>
          <h3
            title={title}
            className="pl-2 text-13px font-medium text-dark-600 dark:text-light-800 md:pl-2.5"
          >
            <AnchorLink
              href={routes.prepperUrl(restaurant_id!)}
              className="hover:text-accent transition-colors"
            >
              {restaurant_name}
            </AnchorLink>
          </h3>
        </div>
      </div>
      <div className="flex flex-col p-4 md:p-6 lg:flex-row lg:space-x-7 xl:space-x-8 xl:p-8 3xl:space-x-10">
        <div className="mb-4 w-full min-w-[360px] flex-col items-center justify-center overflow-hidden md:mb-6 lg:mb-auto xl:flex 3xl:max-w-[795px]">
          <div className="flex flex-col-reverse items-center gap-3 pb-3.5 xs:flex-row-reverse xs:gap-2.5 xs:pb-4 md:flex-nowrap md:gap-3.5 lg:gap-4">
            <AddToCart
              item={{
                ...bundle,
                item_id: data?.item_id,
                item_options: getCheckedOptions(),
                currency: bundle.currency || '£',
              }}
              toastClassName="-mt-10 xs:mt-0"
              className="mt-2.5 w-full flex-1 text-sm xs:mt-0"
            />
          </div>

          {!!gallery?.length ? (
            <ProductThumbnailGallery gallery={gallery} />
          ) : (
            <div className="flex aspect-[3/2] w-auto items-center justify-center bg-dark-200">
              <Image
                alt={title}
                layout="fill"
                quality={100}
                objectFit="contain"
                src={cover_photo || placeholder}
              />
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-col justify-between text-13px lg:w-[400px] xl:w-[520px] 3xl:w-[555px]">
          <div className="pb-7 xs:pb-8 lg:pb-10">
            <div className="pb-5 leading-[1.9em] dark:text-light-600 xl:pb-6 3xl:pb-8">
              <div dangerouslySetInnerHTML={{ __html: description }}></div>
            </div>
            {item_options!.length > 0 && (
              <div className="flex flex-col space-x-6 border-t border-light-500 py-3 dark:border-dark-500 md:py-4 3xl:py-5">
                <div className="flex items-center tracking-[.1px] text-dark dark:text-light">
                  Meal Options:
                </div>
                {item_options!.map((option: any) => (
                  <div key={option.item_option_category_id}>
                    <p className="my-2 text-sm font-semibold">
                      {option.title_cat}
                      {option.is_multi
                        ? ' : ' +
                          totalMealsPicked(option.item_option_category_id) +
                          '/' +
                          getTotalQty(option) +
                          ' selected'
                        : ''}
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
                                    option,
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
                                        false,
                                        item.item_option_id,
                                        option,
                                        option.item_option_category_id
                                      )
                                    }
                                  >
                                    -
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
                                        true,
                                        item.item_option_id,
                                        option,
                                        option.item_option_category_id
                                      )
                                    }
                                  >
                                    <span>+</span>
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
                                  option,
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
            <ProductInformation
              ingredients={ingredients!}
              availability_status={availability_status!}
              price={price}
              currency={currency!}
              className="border-t border-light-500 py-5 dark:border-dark-500 lg:py-6 3xl:py-10"
            />
            <div className="border-t border-light-500 pt-5 dark:border-dark-500">
              <ProductSocialShare
                productSlug={restaurant_id!}
                item_id={data.item_id}
              />
            </div>
          </div>
          <div className="flex flex-col-reverse items-center gap-3 xs:flex-row-reverse xs:gap-2.5 xs:pb-4 md:flex-nowrap md:gap-3.5 lg:gap-4 3xl:pb-14">
            <Button
              isLoading={loading}
              onClick={() => handleCheckout()}
              className="w-full flex-1 text-sm md:h-[52px]"
              variant="outline"
              disabled={isEmpty || loading}
            >
              Proceed to checkout
            </Button>
            <AddToCart
              item={{
                ...bundle,
                item_id: data?.item_id,
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
