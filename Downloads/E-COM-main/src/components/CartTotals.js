import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CartContext from "../context/cartContext";
import UserContext from "../context/userContext";
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
  const {myUser,login}=useContext(UserContext)
  const { total,count, shipping_fee } = useContext(CartContext);
  return (
    <Wrapper>
      <div className="subtotal-card">
        <div className="sub-total-line">
          <h4>Sub Total :</h4>
          <p className="total">{formatPrice(total)}</p>
        </div>
        <div className="sub-total-line">
          <h4>Shippin fee :</h4>
          <p className="total">{formatPrice( shipping_fee)}</p>
        </div>
        <div className="sub-total-line section">
          <h4>Order Total :</h4>
          <p className="total">{formatPrice(3000+total)}</p>
        </div>
        
      </div>
     {myUser?<button className="btn"><Link to="/checkout">Checkout</Link></button>: <button className="btn" ><Link to="/login" onClick={login}>Login </Link></button>}
    </Wrapper>
  );
};

export default CartTotals;
