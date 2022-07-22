import React, { useContext } from 'react'
import CartContext from '../context/cartContext'
import styled from 'styled-components'
import PageHero from '../components/PageHero'
import CartContent from '../components/CartContent'

const Wrapper = styled.main`

    .title-section{
        display:grid;
        grid-template-columns:1fr 1fr 1fr 1fr;

    }
`
const Cart = () => {
    const {cartItems}=useContext(CartContext)
   
  return (
    <Wrapper>
        <PageHero title="Cart"/>
        <CartContent />
    </Wrapper>
  )
}

export default Cart