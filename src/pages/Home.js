import React from "react";
import styled from "styled-components";

import ContactUs from "../components/ContactUs";
import FeaturedProducts from "../components/FeaturedProducts";
import Hero from "../components/Hero";
import Services from "../components/Services";


const Wrapper = styled.main`


`
const Home = () => {
  return (
    <Wrapper className="page-100">
      <Hero />
      <FeaturedProducts />
      <Services />
      <ContactUs />
    </Wrapper>
  );
};

export default Home;
