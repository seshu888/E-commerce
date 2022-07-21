import React, { useState,useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
const UserContext = React.createContext({});

export const UserContextProvider = ({ children }) => {
  const { loginWithRedirect, logout, user } = useAuth0();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [myUser, setMyUser] = useState(null);
  const openSidebar = () => {
    setIsSidebarOpen(true);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const contextValue = {
    openSidebar,
    closeSidebar,
    isSidebarOpen,
    loginWithRedirect,
    logout,
    myUser
  };
  useEffect(() => {
    setMyUser(user);
  }, [user]);
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
export default UserContext;
