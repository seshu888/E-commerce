import React from 'react'
import styled from 'styled-components'
const Footer = () => {
  return (
    <Wrapper>  <h5>
    &copy; {new Date().getFullYear()}
    <span> ComfySloth</span>
  </h5>
  <h5>All rights reserved</h5></Wrapper>
  )
}


const Wrapper = styled.footer`
    height:var(--nav-height);
    display:flex;
    align-items:center;
    background: var(--clr-black);
    justify-content:center;
    color: var(--clr-primary-5);
    @media (max-width:800px){
        flex-direction:column;
    }


`
export default Footer