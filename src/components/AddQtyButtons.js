import React from "react";
import styled from "styled-components";
import { FaPlus, FaMinus } from "react-icons/fa";

const Wrapper = styled.section`
  display: flex;
  padding-top: 1rem;
  align-items: center;
  margin-bottom: 0;
  p {
    font-size: 20px;
    padding: 0 0.5rem;
  }
  @media (max-width:800px){
    p {
      font-size: 10px;
      padding: 0 0.2rem;
    }
  }
`;
const AddQtyButtons = ({qty,increase,decrease}) => {
  return (
    <Wrapper>
      <p>
        <FaMinus onClick={decrease} />
      </p>
      <p className="qty">{qty}</p>
      <p onClick={increase}>
        <FaPlus />
      </p>
    </Wrapper>
  );
};

export default AddQtyButtons;
