import type { Settings } from '@/types';
import { useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/endpoints';

export const useSettings = () => {
  const { data, isLoading, error } = useQuery<Settings, Error>(
    [API_ENDPOINTS.SETTINGS],
    client.settings.all
  );
  return {
    settings: data?.options,
    isLoading,
    error,
  };
};
