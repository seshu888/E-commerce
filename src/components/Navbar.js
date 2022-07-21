import React, { useContext } from "react";
import styled from "styled-components";
import logo from "../assets/logo.svg";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { links } from "../utils/constants";
import CartButtons from "./CartButtons";
import UserContext from "../context/userContext";

const NavContainer = styled.nav`
  height: var(--nav-height);

  display: flex;
  align-items: center;
  justify-content: center;
  .nav-center {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    width: var(--width);
    max-width: var(--max-width);
    margin: 0 auto;
  }
  .nav-toggle {
    display: none;
    background: transparent;
    border: transparent;
    color: var(--clr-primary-5);
    cursor: pointer;
    svg {
      font-size: 2rem;
    }
  }
  .nav-links {
    display: flex;
    justify-content: center;
    li {
      margin: 0 0.5rem;
      margin-bottom:6px;
    }
    a {
      color: var(--clr-grey-3);
      font-size: 1rem;
      text-transform: capitalize;
      letter-spacing: var(--spacing);
      padding: 0.5rem;
   
      &:hover {
        border-bottom: 2px solid var(--clr-primary-7);
      }
    }
  }

  @media (max-width: 800px) {
    .cart-btn-container{
        display:none;
    }


    // very imp bigulu
    .nav-center {
        display: grid;
        grid-template-columns: 1fr ;
    .nav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-toggle {
      display: block;
    }
    .nav-links {
      display: none;
    }
  }
`;
const Navbar = () => {
    const {openSidebar,login} = useContext(UserContext)
  return (
    <NavContainer>
      <div className="nav-center">
        <div className="nav-header">
          <Link to="/">
            <img src={logo} alt="log0" className="logo"/>
          </Link>
          <button type="button" className="nav-toggle" onClick={openSidebar}>
            <FaBars />
          </button>
        </div>
        <ul className="nav-links">
          {links.map((link) => {
            const { id, text, url } = link;
            return (
              <li key={id}>
                <Link to={url} >{text}</Link>
              </li>
            );
          })}
          <li>
          <Link to='/checkout' >
          checkout
        </Link>
          </li>
        </ul>
          <div className="cart-btn-container">
            <CartButtons/>
          </div>
      </div>
    </NavContainer>
  );
};

export default Navbar;
