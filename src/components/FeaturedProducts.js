import React, { useContext } from "react";
import ProductsContext from "../context/productsContext";
import styled from "styled-components";
import ProductItem from "./ProductItem";
import {Link} from 'react-router-dom'

const Wrapper = styled.section`
  background: var(--clr-grey-10);
  .featuredContainer {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .featured {
    padding: 4rem 0;
  }
  .btn{
   margin:0 auto;
   display:block;
   width:150px;
  }
  @media (max-width: 800px) {
    .featuredContainer {
    grid-template-columns: 1fr 1fr;
    }
    .featured {
        padding: 2rem 0;
      }
  }
  @media (max-width: 570px) {
    .featuredContainer {
    grid-template-columns: 1fr;
    }
  }
`;
const FeaturedProducts = () => {
  const { featuredProducts, products } = useContext(ProductsContext);

  return (
    <Wrapper>
      <div className=" section-center section">
        <div className="title">
          <h2>featured products</h2>
          <div className="underline"></div>
        </div>
        <div className="featuredContainer featured">
          {featuredProducts.slice(0, 3).map((item, index) => (
            <ProductItem item={item} key={index} />
          ))}
        </div>
        <Link to="/products" className="btn">All Products</Link>
      </div>
    </Wrapper>
  );
};

export default FeaturedProducts;
