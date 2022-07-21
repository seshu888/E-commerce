import React, { useContext } from "react";
import styled from "styled-components";
import CartContext from "../context/cartContext";
import { formatPrice } from "../utils/helpers";
const Wrapper = styled.section`
  .subtotal-card {
    width: 350px;
    height: 250px;
    padding: 2rem;
    border: 1px solid black;
  }

  .sub-total-line {
    display: flex;
    justify-content: space-between;
  }
  . className="total" {
    display: inline-block;
  }
  .btn{
    width:100%;
    margin:2rem 0;
  }
`;
const CartTotals = () => {
  const { total,count } = useContext(CartContext);
  return (
    <Wrapper>
      <div className="subtotal-card">
        <div className="sub-total-line">
          <h4>Sub Total :</h4>
          <p className="total">{formatPrice(total)}</p>
        </div>
        <div className="sub-total-line">
          <h4>Shippin fee :</h4>
          <p className="total">{formatPrice(3000)}</p>
        </div>
        <div className="sub-total-line section">
          <h4>Order Total :</h4>
          <p className="total">{formatPrice(3000+total)}</p>
        </div>
        
      </div>
      <button className="btn">loging</button>
    </Wrapper>
  );
};

export default CartTotals;
