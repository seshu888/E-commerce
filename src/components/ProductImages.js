import React, { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.section`
  .main {
    height: 500px;
    width: 100%;
    object-fit: cover;
  }
  .subImages {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
  }
  .subImg {
    object-fit:cover;
    height: 100%;
    width: 100%;
    &:hover {
      border: 2px solid var(--clr-primary-5);
    }
  }
  .active{
    border: 2px solid var(--clr-primary-5);

  }
`;
const ProductImages = ({ images }) => {
  const [main, setMain] = useState(images[0]);

  return (
    <Wrapper>
      <img src={main.url} alt="main" className="main" />
      <div className="subImages">
        {images.map((image,index) => {
          return <img src={image.url}  key={index} onClick={()=>setMain(image)} className={main.url === image.url?"active subImg":"subImg"}/>;
        })}
      </div>
    </Wrapper>
  );
};

export default ProductImages;
