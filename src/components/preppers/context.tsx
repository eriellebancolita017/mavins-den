import React, {
  createContext,
  useState,
  useContext,
  FC,
  ReactNode,
} from 'react';
import PropTypes from 'prop-types';

interface UserContextInterface {
  userInfo?: any;
  setUserInfo?: any;
  location?: any;
  setLocation?: any;
}

const defaultState: UserContextInterface = {};

export const UserContext = createContext(defaultState);

const UserContextProvider = ({
  children,
  location,
  setLocation,
}: {
  children: ReactNode;
  location: any;
  setLocation: any;
}) => {
  const [userInfo, setUserInfo] = useState(false);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        location: location,
        setLocation: setLocation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.object,
  value: PropTypes.object,
};

export default UserContextProvider;
export const useUserContext = () => useContext(UserContext);
