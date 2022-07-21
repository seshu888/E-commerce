import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import heroBcg from "../assets/hero-bcg.jpeg";
import heroBcg2 from "../assets/hero-bcg-2.jpeg";

const Wrapper = styled.section`
  display: grid;

  grid-template-columns: 1fr 1fr;
  gap: 4rem;

  .hero-info-container {
    h1 {
      letter-spacing: 0.2rem;
      font-size:2rem;
      margin-bottom:20px;
    }
    p {
      letter-spacing: 0.1rem;
    }
  }
  .img-container {
    display: block;
    position: relative;
  }
  .main-img {
    width: 100%;
    height: 550px;
    position: relative;
    border-radius: var(--radius);
    display: block;
    object-fit: cover;
  }
  .accent-img {
    width: 250px;
    position: absolute;
    bottom: -100px;
    right: 400px;
  }
  @media (max-width: 1200px) {
    .accent-img {
        width: 250px;
        position: absolute;
        bottom: -200px;
        right: 300px;
      }
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;

    .hero-img-container {
      display: none;
    }
  }
`;
const Hero = () => {
  return (
    <Wrapper className="section-center">
      <article className="hero-info-container">
        <h1>
          design your <br />
          comfort zone
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti iure
          quasi odit tenetur unde officiis repudiandae quod deserunt quia eum?
        </p>
        <Link to="/products" className="btn hero-btn">
          shop now
        </Link>
      </article>
      <article className="hero-img-container">
        <img src={heroBcg} alt="nice table" className="main-img" />
       
      </article>
    </Wrapper>
  );
};

export default Hero;
