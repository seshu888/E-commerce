import React, { useState } from "react";
import styled from "styled-components";
import FormInput from "../components/FormInput";
import PageHero from "../components/PageHero";
import { Link } from "react-router-dom";

const Wrapper = styled.section`
  .form-container {
    display: flex;
    justify-content: center;
  }
  .form {
    background: var(--clr-primary-10);
    width: 400px;
    min-height: 70%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    border-top-left-radius: 100px;
    border-bottom-right-radius: 100px;
  }
  .btn {
    width: 100%;
  }
  .sing-up{
    padding:0;
    margin:0;
    font-size:0.8rem;
    text-align:center;
}
`;

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {};
  return (
    <Wrapper>
      <PageHero title="Register" />
      <div className="section section-center page form-container">
        <form className="form" onSubmit={handleSubmit}>
          <FormInput
            handleChange={handleChange}
            value={form.username}
            type="text"
            labelText="Username"
            inputName="username"
          />
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
          <button className="btn"> Register</button>
          <p className="sing-up"><Link to ="/login">Go back to login</Link></p>
        </form>
      </div>
    </Wrapper>
  );
};

export default Register;
