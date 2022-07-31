import type { SEO, Settings } from '@/types';
import { useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/endpoints';

export const useSettings = () => {
  // const { data, isLoading, error } = useQuery<Settings, Error>(
  //   [API_ENDPOINTS.SETTINGS],
  //   client.settings.all
  // );
  return {
    settings: {
      siteTitle: "Marvin's Den - healthy meals marketplace",
      siteSubtitle: 'healthy meals marketplace',
      currency: 'GBP',
      logo: 'https://uploads-ssl.webflow.com/620ad29fb46ac6596379e3a5/620d0dde8482383154cce5b6_Less%20Background%20Logo.png',
      seo: {} as SEO,
      contactDetails: 'support@marvinsden.com',
    },
    isLoading: false,
    error: null,
  };
};
