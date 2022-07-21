import React from "react";
import styled from "styled-components";
import PageHero from "../components/PageHero";
import aboutImg from "../assets/hero-bcg.jpeg";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  width: var(--width);
    max-width: var(--max-width);
    margin: 0 auto;
    padding:3rem 0;


  .about-img {
    width: 100%;
    display: block;
    border-radius: var(--radius);
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows:auto 1fr;
 
  
   
  }
`;
const About = () => {
  return (
    <main>
      <PageHero title="about"/>
      <Wrapper className="page">
        <img src={aboutImg} alt="nice desk" className="about-img" />
        <article>
          <div className="title">
            <h2>our story</h2>
            <div className="underline"></div>
          </div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
            quaerat, modi doloremque necessitatibus eum dolor nesciunt delectus,
            voluptate blanditiis, obcaecati beatae ab aut ipsa consequuntur
            tempora cumque. Ut quo enim vero odio minus nostrum eveniet,
            doloribus veritatis dolorem unde ipsum, voluptatibus totam.
            Explicabo, quas libero! Laborum incidunt minima consequatur ratione?
          </p>
        </article>
      </Wrapper>
    </main>
  );
};

export default About;
