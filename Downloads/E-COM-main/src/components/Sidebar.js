import React, { useContext } from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

import { FaTimes } from "react-icons/fa";

import { links } from "../utils/constants";
import styled from "styled-components";
import CartButtons from "./CartButtons";
import UserContext from "../context/userContext";

const Wrapper = styled.section`
  .sidebar {
    background-color: white;
    width: 100%;
    height: 100%;
    z-index: 1000;
    position: fixed;
    left: 0;
    transform: translateX(-200%);
    transition: all 1s ease;
    top: 0;
    padding: 1rem;
    .cart-btn-container {
      padding: 1rem;
    }
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      .close-btn {
        font-size: 2rem;
        background: transparent;
        border-color: transparent;
        color: var(--clr-primary-5);
        transition: var(--transition);
        cursor: pointer;
        color: var(--clr-red-dark);
        margin-top: 0.2rem;
      }
    }

    .sidebar-links {
      padding: 0.5rem;
      li {
        padding: 0.5rem 0;
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
  }

  .sidebar.show-sidebar {
    transform: translateX(0%);
  }
  @media (min-width: 800px) {
    .sidebar {
      display: none;
    }
    .sidebar.show-sidebar {
      display: none;
    }
  }
`;

const Sidebar = () => {
  const { closeSidebar, isSidebarOpen } = useContext(UserContext);

  return (
    <Wrapper>
      <aside className={isSidebarOpen ? "sidebar show-sidebar" : "sidebar"}>
        <header className="sidebar-header">
          <img src={logo} className="logo" alt="comfy sloth" />
          <button className="close-btn" type="button" onClick={closeSidebar}>
            <FaTimes />
          </button>
        </header>
        <ul className="sidebar-links">
          {links.map(({ id, text, url }) => {
            return (
              <li key={id}>
                <Link to={url} onClick={closeSidebar}>
                  {text}
                </Link>
              </li>
            );
          })}
          <li>
            <Link to="/checkout" onClick={closeSidebar}>
              checkout
            </Link>
          </li>
        </ul>
        <div className="cart-btn-container">
          <CartButtons />
        </div>
      </aside>
    </Wrapper>
  );
};

export default Sidebar;
