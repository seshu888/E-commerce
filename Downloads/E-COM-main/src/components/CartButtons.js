import React, { useContext } from "react";
import { FaShoppingCart, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CartContext from "../context/cartContext";
import UserContext from "../context/userContext";

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  .cart-btn {
    color: var(--clr-grey-1);
    outline: none;
    cursor: pointer;
    display: flex;
    justify-content:center;
    position: relative;
    margin-right: 20px;
    color: var(--clr-grey-1);
    font-size: 1.5rem;
    letter-spacing: var(--spacing);
    p{
      margin-top:4px;
    }
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
  const {  myUser, logout } = useContext(UserContext);
  const {count} = useContext(CartContext)
  return (
    <Wrapper>
      <Link className="cart-btn" to="/cart">
        <p>Cart</p>
        <FaShoppingCart className="cart-icon" />
        <p className="cart-value">{count}</p>
      </Link>

      {!myUser ? (
        <Link className="cart-btn" to="/login" >
          <p>Login</p>
          <FaUserPlus className="cart-icon" />
        </Link>
      ) : (
        <Link className="cart-btn" to="/login"  onClick={logout}>
          <p>Logout</p>
        </Link>
      )}
    </Wrapper>
  );
};

export default CartButtons;
