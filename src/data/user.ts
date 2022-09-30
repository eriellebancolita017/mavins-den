import type { User } from '@/types';
import useAuth from '@/components/auth/use-auth';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/endpoints';
import { useUserContext } from '@/components/preppers/context';
import { useState, useEffect } from 'react';

export function useMe() {
  const { isAuthorized, getToken } = useAuth();
  const { location, userInfo, setUserInfo } = useUserContext();
  const { data, isLoading }: any = useQuery<any, Error>(
    [API_ENDPOINTS.GET_PROFILE],
    () =>
      client.users.getProfile({
        user_id: getToken(),
        type: 'consumer',
        code: 'EN',
      }),
    {
      enabled: isAuthorized,
    }
  );
  useEffect(() => {
    setUserInfo(data?.payload || null);
  }, []);

  return {
    me: !!userInfo
      ? { ...userInfo, ...location }
      : { ...data?.payload, ...location },
    isLoading,
    error: null,
    isAuthorized,
  };
}

export function useLogout() {
  const { unauthorize } = useAuth();
  const { setUserInfo } = useUserContext();
  const queryClient = useQueryClient();
  return useMutation(client.users.logout, {
    onSuccess: () => {
      unauthorize();
      setUserInfo(null);
      // queryClient.resetQueries(API_ENDPOINTS.USERS_ME);
    },
  });
}
