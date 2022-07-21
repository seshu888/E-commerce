import React, { useContext } from "react";
import styled from "styled-components";
import CartContext from "../context/cartContext";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import CartTotals from "./CartTotals";

const Wrapper = styled.section`
  .cart-title {
    display: grid;
    grid-template-columns: 300px 1fr 1fr 1fr auto;
  }
  .cart-empty{
    padding 2rem 0;
    text-align:center;
  }
  
  .cart-items-container {
  }
  .shopping-btns {
    display: flex;
    justify-content: space-between;
    padding: 2rem 0;
  }
  .btn {
    a {
      color: white;
    }
  }
  .clear-btn {
    background: black;
    color: var(--clr-white);
    border-radius: var(--radius);
    letter-spacing: var(--spacing);
    padding: 0.25rem 0.5rem;
    text-transform: capitalize;
  }
  .subtotal-card-container{
    width:100%;
    display:flex;
    justify-content:flex-end;
  }
  .subtotal-card{
            width:400px;
            height:300px;
            padding:1rem;
            border:1px solid grey;
  }

  }
  @media (max-width:800px){
    .subtotal-card-container{
      width:100%;
      display:flex;
      justify-content:center;
    }
    .price{
      display:none;
    }
    .cart-title {
      display: grid;
      grid-template-columns: 120px 1fr 1fr  auto;
    }
    h5{
      font-size:0.7rem;
    }
    .btn{
      font-size:0.5rem;
      padding:0.3rem 0.2rem;
    }
    .subtotal-card{
      width:100%;
      height:300px;
      padding:1rem;
      border
}
 
`;
const CartContent = () => {
  const { cartItems, count, total } = useContext(CartContext);
  if(count<=0){

    return     <Wrapper className="page" > <h1 className="cart-empty">your cart is empty</h1></Wrapper>
  }
  return (
    <Wrapper className="section section-center page">
      <div className="cart-title">
        <h5>item</h5>
        <h5 className="price">price</h5>
        <h5>quantity</h5>
        <h5>subtotal</h5>
        <span></span>
      </div>
      <hr />

      <div className="cart-items-container">
        {cartItems.map((item, index) => (
          <CartItem item={item} key={index} />
        ))}
      </div>
      <hr />
      <div className="shopping-btns">
        <button className="btn ">
          <Link to="/products">Continue to shopping</Link>
        </button>
        <button type="button" className=" btn link-btn clear-btn">
          clear shopping cart
        </button>
      </div>
      <div className="subtotal-card-container">
        <CartTotals />
      </div>
    </Wrapper>
  );
};

export default CartContent;
