import React, { useContext, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import styled from "styled-components";
import FormInput from "../components/FormInput";
import PageHero from "../components/PageHero";
import UserContext from "../context/userContext";


const Wrapper = styled.section`
.form-container{
    display:flex;
    justify-content:center;
}
    .form{
        background: var(--clr-primary-10);
        width:400px;
        min-height:70%;
        box-shadow:0 5px 15px rgba(0, 0, 0, 0.1);
        padding:2rem;
        border-top-left-radius:100px;
        border-bottom-right-radius:100px;
    }
    .btn{
        width:100%;
    }
    .sing-up{
        padding:0;
        margin:0;
        font-size:0.8rem;
        text-align:center;
    }
`;

const Login = () => {
  const navigate = useNavigate()
  const {login} = useContext(UserContext)
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if(form.email.trim().length>6 && form.password.trim().length>0){
      login(form)
      navigate('/')
      
      
    } 
  };
  const handleChange = (e) => {
    setForm({...form,[e.target.name]:e.target.value})
  };
  return (
    <Wrapper >
      <PageHero title="login" />
      <div className="section section-center page form-container" >
        <form className="form" onSubmit={handleSubmit}>
          <FormInput
            handleChange={handleChange}
            value={form.email}
            type="email"
            labelText="Email"
            inputName="email"
          />
          <FormInput
            handleChange={handleChange}
            value={form.password}
            type="password"
            labelText="Password"
            inputName="password"
          />
          <button className="btn"> Login</button>
            <p className="sing-up"><Link to ="/register">dont you have an accoutn ?Sign Up</Link></p>
        </form>
      </div>
    </Wrapper>
  );
};

export default Login;
