import React, { useContext } from "react";
import styled from "styled-components";
import PageHero from "../components/PageHero";
import StripeCheckout from "../components/StripeCheckout";

// extra imports

import { Link } from "react-router-dom";
import UserContext from "../context/userContext";
import CartContext from "../context/cartContext";

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  .empty {
    text-align: center;
  }
`;

const CheckoutPage = () => {
  const { cartItems } = useContext(CartContext);
  
  return (
    <main>
      <PageHero title="checkout" />
      <Wrapper className="page">
        {cartItems.length < 1 ? (
          <div className="empty">
            <h2>your cart is empty</h2>
            <Link to="/products" className="btn">
              fill it
            </Link>
          </div>
        ) : (
          <StripeCheckout />
        )}
      </Wrapper>
    </main>
  );
};

export default CheckoutPage;
