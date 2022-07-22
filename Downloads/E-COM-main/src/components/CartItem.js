import React, { useContext } from "react";
import { formatPrice } from "../utils/helpers";

import styled from "styled-components";
import { FaTrash } from "react-icons/fa";
import CartContext from "../context/cartContext";
import AddQtyButtons from "./AddQtyButtons";

const Wrapper = styled.main`
  display: grid;
  grid-template-columns: 300px 1fr 1fr 1fr auto;
  align-items: center;
  padding: 2rem 0;
  .cart-item-img {
    height: 100px;
    width: 100px;
    object-fit: cover;
    margin-right: 4px;
  }
  .title {
    display: flex;
  }
  .color-circle {
    width: 1rem;
    height: 1rem;

    display: inline-block;

    border-radius: 50%;
  }
  .remove-btn {
    outline: none;
    border: none;
    background: transparent;
  }
  .price-small {
    display: none;
  }
  .price {
    display: block;
  }
  .item-info {
    diplay: flex;
    justify-content: flex-start;
  }
  @media (max-width: 800px) {
    display: grid;
    grid-template-columns: 150px 1fr 1fr auto;
    .cart-item-img {
      height: 80px;
      width: 50px;
      object-fit: cover;
      margin-right: 2px;
    }
    .price-small {
      display: block;
      font-size: 0.5rem;
    }
    .price {
      display: none;
    }
    .name {
      font-size: 0.5rem;
      margin: 0;
      padding: 0;
    }
    .item-info {
    }
    .subtotal {
      font-size: 0.6rem;
    }
  }
  @media (max-width: 400px) {
    display: grid;
    grid-template-columns: 130px 1fr 1fr auto;
  }
`;
const CartItem = ({ item }) => {
  const { removeItem, incrementCartItemQty, decrementCartItemQty } =
    useContext(CartContext);

  const increase = () => {
    incrementCartItemQty(item.id);
  };
  const decrease = () => {
    decrementCartItemQty(item.id);
  };
  return (
    <Wrapper>
      <div className="title">
        <img src={item.image} alt={item.name} className="cart-item-img" />
        <div className="item-info">
          <h5 className="name">{item.name}</h5>
          <p className="color">
            color :
            <span
              style={{ backgroundColor: item.color }}
              className="color-circle"
            ></span>
          </p>
          <h5 className="price-small">{formatPrice(item.price)}</h5>
        </div>
      </div>
      <h5 className="price">{formatPrice(item.price)}</h5>
      <h5 className="subtotal">
        <AddQtyButtons qty={item.qty} increase={increase} decrease={decrease} />
      </h5>
      <h5 className="subtotal">{formatPrice(item.price * item.qty)}</h5>
      <button
        type="button"
        className="remove-btn"
        onClick={() => removeItem(item.id)}
      >
        <FaTrash />
      </button>
    </Wrapper>
  );
};

export default CartItem;
