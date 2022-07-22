import React from "react";
import styled from "styled-components";

const Wrapper = styled.section`
  display: grid;
  padding: 10rem 0;
  grid-template-columns: 1fr 1fr;
gap:3rem;
  .contact-content {
    h3 {
      padding: 2rem 0;
    }
  }
  .form {
    display: flex;
    align-items: center;
    justify-content: center;
    .email{
      width:80%; 
      padding:0.35rem;
      border-color:var(--clr-primary-5);
      
    }
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    padding: 2rem 0;
  }
`;
const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Wrapper className="section-center">
      <div className="contact-content">
        <h3>Join our newsletter and get 20% off</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum veniam
          repudiandae vel ab id, fuga praesentium nobis natus ipsam vero?
        </p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <input  className="email" placeholder="email"/>
        <input type="submit" className="btn" />
      </form>
    </Wrapper>
  );
};

export default ContactUs;
