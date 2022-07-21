import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
const Wrapper = styled.div`
  background: var(--clr-primary-10);
  width: 100%;
  height: var(--page-hero-height);
  display: flex;
  align-items: center;
  a {
    color:var(--clr-primary-3);
    paddding: 0.5rem;
  }
`;

const PageHero = ({ title, product }) => {
  return (
    <Wrapper>
      <div className="section-center">
      <h3>
        <Link to="/">Home</Link>
        {product && <Link to="/products"> / Products</Link>}
        <span> / </span>
        <span> {title}</span>
        </h3>
      </div>
    </Wrapper>
  );
};

export default PageHero;
