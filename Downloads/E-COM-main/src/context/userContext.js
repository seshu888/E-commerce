import React, { useState, useEffect } from "react";

const UserContext = React.createContext({});

export const UserContextProvider = ({ children }) => {
  let user = localStorage.getItem("user")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [myUser, setMyUser] = useState(user || null);
  const openSidebar = () => {
    setIsSidebarOpen(true);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  const login = (data) => {
    setMyUser(data);
    localStorage.setItem("user", data);
  };
  const logout = () => {
    setMyUser(null);
    localStorage.removeItem("user");
  };

  const contextValue = {
    openSidebar,
    closeSidebar,
    isSidebarOpen,
    login,
    logout,
    myUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
export default UserContext;
