import React from 'react'
import MainNavigation from './MainNavigation'

const Layout=(props)=>{
    return(
        <div>
            <MainNavigation/>
            {props.children}
        </div>

    )
}
export default Layout