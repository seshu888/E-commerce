import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserContextProvider } from "./context/userContext";
import { ProductsContextProvider } from "./context/productsContext";
import { CartContextProvider } from "./context/cartContext";
import { Auth0Provider } from "@auth0/auth0-react";

// dev-kzgv0h-d.us.auth0.com domain
// ShIe0l1aQ2eKMZFvOmFPZdc1N09u30nd cliend id

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <Auth0Provider
        domain="dev-kzgv0h-d.us.auth0.com"
        clientId="ShIe0l1aQ2eKMZFvOmFPZdc1N09u30nd"
        redirectUri={window.location.origin}
        cacheLocation="localstorage"
      >
        <CartContextProvider>
          <ProductsContextProvider>
            <UserContextProvider>
              <App />
            </UserContextProvider>
          </ProductsContextProvider>
        </CartContextProvider>
      </Auth0Provider>
    </UserContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
