import React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
const ErrorPage = () => {
  return (
    <Wrapper className='page-100'>
    
        <h1>Not Found</h1>
        <Link to="/">Back to Home</Link>
    </Wrapper>
  )
}

const Wrapper = styled.div`
display:flex;
align-items:center;
flex-direction:column;
justify-content:center;
background: var(--clr-primary-10);


`

export default ErrorPage