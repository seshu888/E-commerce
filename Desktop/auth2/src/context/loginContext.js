import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { withRouter } from 'react-router';

const AuthContext= React.createContext({
    token:'',
    isLoggedIn:false,
    login:(token)=>{},
    logout:()=>{}
})

 export const LoginContextProvider=(props)=>{

    const initialToken=localStorage.getItem('token')
    const [token,setToken]=useState(initialToken)
    const isLoggedIn=!!token;
    const history=useHistory();


    const logoutHandler=()=>{
        setToken(null)
        localStorage.removeItem('token')

    }
    const loginHandler=(token)=>{
        setToken(token)
        localStorage.setItem('token',token)
       
    }
    const contextValue={
        token:token,
        isLoggedIn:isLoggedIn,
        login:loginHandler,
        logout:logoutHandler
    }
    return(
        <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
    )
}
export default AuthContext;
