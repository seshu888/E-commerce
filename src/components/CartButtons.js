import React from "react";
import { FaShoppingCart, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;

    .cart-btn {
      color: var(--clr-grey-1);
      outline: none;
      cursor: pointer;
      display: flex;
      position: relative;
        margin-right:20px;
      color: var(--clr-grey-1);
      font-size: 1.5rem;
      letter-spacing: var(--spacing);
    }
    .cart-icon {
      margin-top: 10px;
    }
    .cart-value {
      position: absolute;
      top: 0px;
      right: -10px;
      background: var(--clr-primary-5);
      font-size: 0.8rem;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--clr-white);
    }
  
`;
const CartButtons = () => {
  return (
    <Wrapper>
      <Link className="cart-btn" to="/cart">
        <p>Cart</p>
        <FaShoppingCart className="cart-icon" />
        <p className="cart-value">10</p>
      </Link>

      {true ? (
        <Link className="cart-btn" to="/auth">
          <p>Login</p>
          <FaUserPlus className="cart-icon" />
        </Link>
      ) : (
        <Link className="cart-btn" to="/auth">
          <p>Logout</p>
        </Link>
      )}
    </Wrapper>
  );
};

export default CartButtons;
