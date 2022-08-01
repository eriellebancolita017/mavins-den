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

  React.useEffect(() => {
    if (state.isEmpty) {
      resetCart();
    }
  }, [state.isEmpty]);

  const { data, refetch } = useQuery<any>(
    [API_ENDPOINTS.GET_ALL_IN_CART, userInfo, location],
    () => {
      return client.cart.getAllInCart(
        isAuthorized
          ? `${userInfo.consumer_id}/consumer/EN`
          : `${location.address}/guest/EN`
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
      refetch();
      setTimeout(() => {
        dispatch({
          type: 'READ_FROM_API',
          allItems: data?.payload.cartItems || [],
        });
      }, 500);
    }
  }, [refetch, userInfo, isAuthorized, data]);

  const { mutate: addingItemToCart, isLoading: adding } = useMutation(
    [API_ENDPOINTS.ADD_TO_CART, userInfo, location],
    client.cart.addItemToCart,
    {}
  );

  const { mutate: deleteItemFromCart } = useMutation(
    client.cart.removeFromCart
  );

  const addItemToCart = (item: Optional<Item, 'qty'>, quantity: number) => {
    addingItemToCart(
      {
        consumer_id: userInfo?.consumer_id || null,
        item_id: item.item_id,
        qty: quantity,
        item_options: item.item_options || [],
        restaurant_id: item.restaurant_id,
        item_instruction: null,
        code: 'EN',
        ...(isAuthorized ? { device_id: location.address } : {}),
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

          toast.success(<b>Successfully added to the basket!</b>, {
            className: '-mt-10 xs:mt-0',
          });
        },
        onError: (error: any) => {
          console.log('error', error, error.response);
          if (error.response.status === 406) {
            toast.error(
              <b>
                You have already added from other restaurant. Do you want to
                replace it?
              </b>,
              {
                duration: 4000,
                className: '-mt-10 xs:mt-0 w-2xl',
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

  const clearItemFromCart = (id: Item['item_id']) => {
    deleteItemFromCart(
      `${
        isAuthorized
          ? `consumer/${userInfo.consumer_id}/`
          : `guest/${location.address}/`
      }${state.items.find((i) => i.item_id === id)?.cart_id!}`,
      {
        onSuccess: () => {
          dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id });
          toast.success(<b>Successfully removed from basket!</b>, {
            className: '-mt-10 xs:mt-0',
          });
          refetch();
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
  const resetCart = () => dispatch({ type: 'RESET_CART' });
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
