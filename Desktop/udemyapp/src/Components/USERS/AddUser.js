import React,{useState} from 'react'
import Card from '../UI/Card'
import classes from './AddUser.module.css'
import ErrorModal from './ErrorModal';



const AddUser=(props)=>{
    const  [name,setName]=useState('')
    const  [age,setAge]=useState('')
    const [error ,setError]=useState(null )
    const handleSubmit=(e)=>{
        e.preventDefault();
        if(name.trim().length === 0 || age.trim().length===0){
            return setError({
                title:'Invalid input',
                message:'please enter valid name and age value'
            })
        }
        if(parseInt(age)<1){
            return  setError({
                title:'Invalid input',
                message:'please enter valid  age value>0'
            })
        }
        props.onAddUser(name,age)
        setName('');
        setAge('')
    }
    const userNameHandler=(e)=>{
     setName(e.target.value)
    }
    const ageHandler=(e)=>{
        setAge(e.target.value)
    }
    const errorHandler=()=>{
        setError(null)
    }
    return(
        <div>
        {error &&  <ErrorModal message={error.message} title={error.title} errorHandler={errorHandler}/>}
      <Card  className={classes.input}>
        <form onSubmit={(e)=>handleSubmit(e)}>
            <input placeholder="name" value={name} type="text"  onChange={userNameHandler}></input>
            <input placeholder="age" value={age} type="text"  onChange={ageHandler}></input>
            <button type="submit">Add User</button>
        </form>

  </Card>
  </div>
    )
}
export default AddUser