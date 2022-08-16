import React, { useCallback } from 'react';
import { cartReducer, State, initialState } from './cart.reducer';
import {
  Item,
  getItem,
  inStock,
  VerifiedResponse,
  Optional,
} from '@/components/cart/lib/cart.utils';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { CART_KEY } from '@/lib/constants';
import { isEmpty } from 'lodash';
import { useUserContext } from '@/components/preppers/context';
import { useMutation, useQuery } from 'react-query';
import client from '@/data/client';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import useAuth from '@/components/auth/use-auth';

import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';
interface CartProviderState extends State {
  addItemToCart: (item: Optional<Item, 'qty'>, quantity: number) => void;
  removeItemFromCart: (id: Item['item_id']) => void;
  clearItemFromCart: (id: Item['item_id']) => void;
  getItemFromCart: (id: Item['item_id']) => any | undefined;
  isInCart: (id: Item['item_id']) => boolean;
  isInStock: (id: Item['item_id']) => boolean;
  resetCart: () => void;
  setVerifiedResponse: (response: VerifiedResponse) => void;
  adding: boolean;
}
export const cartContext = React.createContext<CartProviderState | undefined>(
  undefined
);

cartContext.displayName = 'CartContext';

export const useCart = () => {
  const context = React.useContext(cartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  return context;
};

export const CartProvider: React.FC = (props) => {
  const [savedCart, saveCart] = useLocalStorage(
    CART_KEY,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(
    cartReducer,
    JSON.parse(savedCart!)
  );
  const { location, userInfo } = useUserContext();
  const { isAuthorized } = useAuth();

  // React.useEffect(() => {
  //   if (state.isEmpty) {
  //     resetCart();
  //   }
  // }, [state.isEmpty]);

  const { data, refetch } = useQuery<any>(
    [API_ENDPOINTS.GET_ALL_IN_CART, userInfo, location],
    () => {
      return client.cart.getAllInCart(
        isAuthorized
          ? `${userInfo.consumer_id}/consumer/EN`
          : `${location.guestInfo}/guest/EN`
      );
    },
    {
      enabled: false,
      cacheTime: 0,
      staleTime: 0,
    }
  );

  React.useEffect(() => {
    saveCart(JSON.stringify(state));
  }, [state, saveCart, data]);

  // React.useEffect(() => {
  //   dispatch({
  //     type: 'READ_FROM_API',
  //     allItems: data?.payload.cartItems || [],
  //   });
  // }, [data]);

  React.useEffect(() => {
    if ((isAuthorized && !!userInfo) || !isAuthorized) {
      setTimeout(() => {
        refetch();
        dispatch({
          type: 'READ_FROM_API',
          allItems: data?.payload.cartItems || [],
          order_pickup_date: data?.payload.order_pickup_date || '',
        });
      }, 500);
    }
  }, [refetch, userInfo, location, isAuthorized, data]);

  const { mutate: addingItemToCart, isLoading: adding } = useMutation(
    [API_ENDPOINTS.ADD_TO_CART, userInfo, location],
    client.cart.addItemToCart,
    {}
  );

  const { mutate: deleteItemFromCart } = useMutation(
    client.cart.removeFromCart
  );

  const { mutate: deleteAllFromCart } = useMutation(
    client.cart.removeAllFromCart
  );

  const addItemToCart = (item: Optional<Item, 'qty'>, quantity: number) => {
    console.log('isauth', isAuthorized);
    addingItemToCart(
      {
        item_id: item.item_id,
        qty: quantity,
        item_options: item.item_options || [],
        restaurant_id: item.restaurant_id,
        item_instruction: null,
        code: 'EN',
        ...(!isAuthorized
          ? { device_id: location.guestInfo }
          : { consumer_id: userInfo?.consumer_id }),
      },
      {
        onSuccess: (res) => {
          if (res.error) {
            toast.error(<b>Something went wrong</b>, {
              className: '-mt-10 xs:mt-0',
            });
            return;
          }
          dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity });
          refetch();

          // google analytics
          logEvent(analytics, 'add_to_cart', {
            currency: 'GBP',
            value: item.price,
            items: [{ ...item }],
          });

          toast.success(<b>Successfully added to the basket!</b>, {
            className: '-mt-10 xs:mt-0',
          });
        },
        onError: (error: any) => {
          console.log('error', error, error.response);
          if (error.response.status === 406) {
            toast.error(
              (t) => (
                <div className="mt-4 mb-2">
                  <b className="mb-3 block">Replace cart item?</b>
                  <span>
                    Your cart contains dishes from another meal prepper. Do you
                    want to replace them?
                  </span>
                  <div className="mt-2 mr-3 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        replaceCart(item, quantity);
                        toast.dismiss(t.id);
                      }}
                      className="font-bold text-brand hover:text-brand-dark"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="font-bold text-brand hover:text-brand-dark"
                    >
                      No
                    </button>
                  </div>
                </div>
              ),
              {
                duration: 12000,
                className: '-mt-10 xs:mt-0 w-2xl',
                icon: '',
              }
            );
            return;
          }
          toast.error(<b>Something went wrong</b>, {
            className: '-mt-10 xs:mt-0',
          });
        },
      }
    );
  };

  const replaceCart = (item: Optional<Item, 'qty'>, quantity: number) => {
    deleteAllFromCart(
      `${
        isAuthorized
          ? `consumer/${userInfo.consumer_id}`
          : `guest/${location.guestInfo}`
      }`,
      {
        onSuccess: () => {
          addItemToCart(item, quantity);
        },
        onError: (error: any) => {
          console.log('error', error, error.response);
          toast.error(<b>Something went wrong</b>, {
            className: '-mt-10 xs:mt-0',
          });
        },
      }
    );
  };

  const clearItemFromCart = (id: Item['item_id']) => {
    deleteItemFromCart(
      `${
        isAuthorized
          ? `consumer/${userInfo.consumer_id}/`
          : `guest/${location.guestInfo}/`
      }${state.items.find((i) => i.item_id === id)?.cart_id!}`,
      {
        onSuccess: () => {
          dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id });
          toast.success(<b>Successfully removed from basket!</b>, {
            className: '-mt-10 xs:mt-0',
          });
          refetch();

          // google analytics
          logEvent(analytics, 'remove_from_cart', {
            // currency: "GBP",
            // value: item.price,
            items: [{ ...state.items.find((i) => i.item_id === id) }],
          });
        },
        onError: (error: any) => {
          console.log('error', error, error.response);
          toast.error(<b>Something went wrong</b>, {
            className: '-mt-10 xs:mt-0',
          });
        },
      }
    );
  };

  const removeItemFromCart = (id: Item['item_id']) =>
    dispatch({ type: 'REMOVE_ITEM', id });
  const setVerifiedResponse = (response: any) =>
    dispatch({ type: 'SET_VERIFIED_RESPONSE', response });
  const isInCart = useCallback(
    (id: Item['item_id']) => !!getItem(state.items, id),
    [state.items]
  );
  const getItemFromCart = useCallback(
    (id: Item['item_id']) => getItem(state.items, id),
    [state.items]
  );
  const isInStock = useCallback(
    (id: Item['item_id']) => inStock(state.items, id),
    [state.items]
  );
  const resetCart = () => {
    deleteAllFromCart(
      `${
        isAuthorized
          ? `consumer/${userInfo.consumer_id}`
          : `guest/${location.guestInfo}`
      }`,
      {
        onSuccess: () => {
          dispatch({ type: 'RESET_CART' });
        },
        onError: (error: any) => {
          console.log('error', error, error.response);
          toast.error(<b>Something went wrong</b>, {
            className: '-mt-10 xs:mt-0',
          });
        },
      }
    );
  };
  const value = React.useMemo(
    () => ({
      ...state,
      addItemToCart,
      removeItemFromCart,
      clearItemFromCart,
      getItemFromCart,
      setVerifiedResponse,
      isInCart,
      isInStock,
      resetCart,
      adding,
    }),
    [getItemFromCart, isInCart, isInStock, state]
  );
  return <cartContext.Provider value={value} {...props} />;
};
