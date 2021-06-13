import React from 'react';
import Card from '../UI/Card'
import classes from './UserList.module.css'

const UserList=(props)=>{
    return(
        <Card className={classes.users}>
       {props.users.map((user,index)=>(
           <li key={user.id}>{user.name} {user.age}</li>
       ))}
        </Card>
    )
}
export default UserList