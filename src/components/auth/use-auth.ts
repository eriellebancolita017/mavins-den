import { atom, useAtom } from 'jotai';
import {
  checkHasAuthToken,
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from '@/data/client/token.utils';

const authorizationAtom = atom(checkHasAuthToken());
export default function useAuth() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom);
  return {
    setToken: setAuthToken,
    getToken: getAuthToken,
    isAuthorized,
    authorize(token: string) {
      setAuthToken(token);
      setAuthorized(true);
    },
    unauthorize() {
      setAuthorized(false);
      removeAuthToken();
    },
  };
}
