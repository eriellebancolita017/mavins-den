import type { User } from '@/types';
import useAuth from '@/components/auth/use-auth';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/endpoints';
import { useUserContext } from '@/components/preppers/context';

export function useMe() {
  const { isAuthorized } = useAuth();
  const { location, userInfo } = useUserContext();
  // const { data, isLoading, error } = useQuery<User, Error>(
  //   [API_ENDPOINTS.USERS_ME],
  //   client.users.me,
  //   {
  //     enabled: isAuthorized,
  //   }
  // );
  return {
    me: { ...userInfo, ...location },
    isLoading: false,
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
