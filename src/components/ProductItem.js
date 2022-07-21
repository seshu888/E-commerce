import React from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/helpers";
const Wrapper = styled.article`
  position: relative;

  .featured-product-img {
    position: relative;
    .product-search-icon {
      opacity: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
      background: var(--clr-primary-5);
      svg {
        font-size: 1.25rem;
        color: var(--clr-white);
      }
    }

    img {
      width: 100%;
      height: 300px;
      transition: all 1s ease;
      border-radius:10px;
      box-shadow:rgba(0,0,0,0.7)
    }
  }
  .featured-product-img:hover .product-search-icon {
    opacity: 1;
  }
  .featured-product-img:hover img {
    opacity: 0.6;
  }

  .featured-product-info {
    display: flex;
    justify-content: space-between;
    .price {
      color: var(--clr-primary-5);
      letter-spacing: var(--spacing);
    }
  }
`;
const ProductItem = ({ item }) => {

  const { image, id, price, name } = item;
  return (
    <Wrapper className="">
      <div className="featured-product-img">
        <img src={image} alt={name} />
        <Link to={`/products/${id}`} className="product-search-icon">
          <FaSearch />
        </Link>
      </div>
      <div className="featured-product-info">
        <p className="name">{name}</p>
        <p className="price">{formatPrice(price)}</p>
      </div>
    </Wrapper>
  );
};

export default ProductItem;
