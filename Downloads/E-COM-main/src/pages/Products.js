import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import ProductsContext from "../context/productsContext";
import styled from "styled-components";
import ProductItem from "../components/ProductItem";
import PageHero from "../components/PageHero";

const Wrapper = styled.main`
  .products-container {
    display: grid;
    gap:2rem;
    grid-template-columns: 1fr 1fr 1fr ;
  }
  @media (max-width: 800px) {
    .products-container {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 570px) {
    .products-container {
      grid-template-columns: 1fr ;
    }
  }
`;
const Products = () => {
  const { products } = useContext(ProductsContext);
  const location = useLocation();

  return (
    <Wrapper>
    <PageHero title="products"/>
      <div className="products-container section section-center page-100">

        {products && products.map((item,index) => <ProductItem item={item} key={index}/>)}
      </div>
    </Wrapper>
  );
};

export default Products;
