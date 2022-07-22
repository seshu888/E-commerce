import React from "react";
import styled from "styled-components";
import { services } from "../utils/constants";

const Wrapper = styled.div`
  padding: 5rem 0;

  background: var(--clr-primary-10);
  h3,
  h4 {
    color: var(--clr-primary-1);
  }
  .header {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .header h3 {
    margin-bottom: 2rem;
  }
  p {
    margin-bottom: 0;
    line-height: 1.8;
    color: var(--clr-primary-3);
  }
  .services{
    display:grid;
    grid-template-columns:1fr 1fr 1fr;
    gap:2rem;
    padding:5rem 0;
  }
  .service{
    width:100%;
    height:300px;
    background: var(--clr-primary-7);
    text-align: center;
    padding: 2.5rem 2rem;
    border-radius: var(--radius);
  }
  @media (max-width:800px){
    .header {
        grid-template-columns: 1fr ;
    }
    .services{

        grid-template-columns:1fr;

        padding:2rem 0;
      }
  }
`;
const Services = () => {
  return (
    <Wrapper>
      <div className="section-center">
        <article className="header">
          <h3>
            custom furniture <br />
            built only for you
          </h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
            quisquam saepe id reiciendis sunt, repudiandae libero amet rem quia
            quod?
          </p>
        </article>
        <div className="services">
          {services.map((service) => {
            const { id, icon, title, text } = service;
            return (
              <article key={id} className="service">
                <span className="icon">{icon} </span>
                <h4>{title}</h4>
                <p>{text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
};

export default Services;
