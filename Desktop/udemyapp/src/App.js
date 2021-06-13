import React, { useState } from 'react';


import './App.css';
import AddUser from './Components/USERS/AddUser'
import UserList from './Components/USERS/UserList';

const App = () => {
const [usersList,setUsersList]=useState([])
const addUserHandleer=(name,age)=>{
  setUsersList((prevList)=>{
    return [...prevList,{name,age,id:Math.random().toString()}]
  })
}
  return (
    <div>
    <AddUser onAddUser={addUserHandleer}/>
    <UserList users={usersList}/>
    </div>
  );
};

export default App;
