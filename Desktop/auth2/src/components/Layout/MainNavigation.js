import React ,{useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/loginContext'

const MainNavigation=()=>{
    const authCtx=useContext(AuthContext)
    return(
        <div style={{backgroundColor:'blue',width:'100vw',height:'10vh',display:'flex',justifyContent:'space-between',padding:'20px'}}>
            <p style={{color:'white'}} ><Link to="/" style={{color:'white'}} >MainNavigation</Link></p>
            <div style={{display:'flex'}}>
              { !authCtx.isLoggedIn && <p  ><Link to="/login" style={{color:'white'}} >Login</Link></p>}
               {authCtx.isLoggedIn &&  <p style={{color:'white',marginLeft:'40px'}}><Link to="/profile" style={{color:'white'}} >Profile</Link></p>}
               {authCtx.isLoggedIn && <p style={{color:'white',marginLeft:'40px'}}><Link onClick={authCtx.logout}  style={{color:'white'}} >Logout</Link></p>}
            </div>
        </div>
    )
}
export default MainNavigation