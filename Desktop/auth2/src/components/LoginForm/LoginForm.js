import React,{useRef,useContext,useState} from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import AuthContext from '../../context/loginContext'
const LoginForm=()=>{
    const [isLogin,setIsLogin]=useState(false)
    const userRef=useRef();
    const passRef= useRef()
    const history=useHistory()
    const authCtx=useContext(AuthContext)
    const sumbitHandler=(e)=>{
        e.preventDefault()
        let obj={
            email:userRef.current.value,
            password:passRef.current.value,
            returnSecureToken:true }

        let url;
        if (isLogin) {
            url =
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB1e7kdx55n7A8x0_1PgtJ46MI2IHgQEcM'

          } else {
            url =
              'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB1e7kdx55n7A8x0_1PgtJ46MI2IHgQEcM'
          }
          const res =  axios.post(url, obj, {
            headers: {
                'Content-Type': 'application/json',
            }
          })     
          .then((res)=>{
              console.log(res.data.idToken)
            authCtx.login(res.data.idToken);
            history.replace('/')
          })
          .catch((err)=>{
             
          })
        

    
    }
    const handleLoginAndCreate=()=>{
        setIsLogin((prevState)=>!prevState)
    }
    return(
        <div>
            <form onSubmit={sumbitHandler}>
                <label htmlFor="email">Email</label><br/>
                <input type="email" ref={userRef} id="email"></input><br/>
                <label htmlFor="password">Password</label><br/>
                <input type="password" ref={passRef} id="password"></input><br/>
                <button type="submit" className="mt-3" >{isLogin?'Login':'create Account'}</button>
                <p className="mt-3" onClick={handleLoginAndCreate}>{isLogin?'go to create Account':'Go to Login'}</p>
            </form>
        </div>
    )
}
export default LoginForm