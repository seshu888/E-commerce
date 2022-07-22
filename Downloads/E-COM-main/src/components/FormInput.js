import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.article`
    width:100%;
    padding:1rem 0;
    input{
        width:100%;
        padding:0.5rem ;
        outline:none;
        border:none;
        border-radius:4px;
        margin:0.3rem 0;
    }
`
const FormInput = ({labelText,inputName,type,value,handleChange}) => {
  return (
    <Wrapper>
        <label htmlFor={inputName}>{labelText || inputName}</label>
        <input onChange={handleChange} type={type} name={inputName} value={value} placeholder={inputName} />

    </Wrapper>
  )
}

export default FormInput