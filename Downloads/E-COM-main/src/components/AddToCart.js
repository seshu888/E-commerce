import React, { useContext, useState } from "react";
import styled from "styled-components";
import { FaCheck } from "react-icons/fa";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProductsContext from "../context/productsContext";
import CartContext from "../context/cartContext";
import AddQtyButtons from "./AddQtyButtons";
const Wrapper = styled.section`
  padding: 2rem 0;
  .colors-container {
    display: flex;
  }
  .color {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 0 0.4rem;
  }
  .active {
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      color: white;
    }
  }

  a {
    color: white;
  }
`;

const AddToCart = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [activeColor, setActiveColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);


  const increase=()=>{
    setQty(qty+1)
  }
  const decrease=()=>{
    setQty(qty<=1? 1:qty-1)
  }
  return (
    <Wrapper>
      <div className="colors-container">
        {product.colors.map((color, index) => (
          <div
            className={activeColor === color ? "color active" : "color"}
            style={{ backgroundColor: color }}
            key={index}
            onClick={() => setActiveColor(color)}
          >
            {activeColor === color ? <FaCheck /> : null}
          </div>
        ))}
      </div>
      <div className="btn-container">
            <AddQtyButtons increase={increase} decrease={decrease} qty={qty}/>
        <button
          className="btn"
          onClick={() => addToCart(activeColor, qty, product)}
        >
          <Link to="/cart">Add To Cart</Link>
        </button>
      </div>
    </Wrapper>
  );
};

export default AddToCart;
