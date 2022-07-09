import type { User } from '@/types';
import useAuth from '@/components/auth/use-auth';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/endpoints';

export function useMe() {
  const { isAuthorized } = useAuth();
  const { data, isLoading, error } = useQuery<User, Error>(
    [API_ENDPOINTS.USERS_ME],
    client.users.me,
    {
      enabled: isAuthorized,
    }
  );
  return {
    me: data,
    isLoading,
    error,
    isAuthorized,
  };
}

export function useLogout() {
  const { unauthorize } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(client.users.logout, {
    onSuccess: () => {
      unauthorize();
      queryClient.resetQueries(API_ENDPOINTS.USERS_ME);
    },
  });
}
