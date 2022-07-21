import axios from "axios";
import React, { useReducer, useState, useEffect } from "react";
import products_reducer from "../reducers/products_reducer";
import { products_url } from "../utils/constants";
import { single_product_url } from "../utils/constants";

const initialState = {
  featuredProducts: [],
  productsLoading: false,
  products: [],
  productsError: null,
  singleProduct: null,
  singleProductLoading: false,
  singleProductError: null,
};
const ProductsContext = React.createContext({});

export const ProductsContextProvider = ({ children }) => {
  const [{ featuredProducts, productsLoading, products , singleProduct ,productsError,singleProductLoading,singleProductError }, dispatchFn] =
    useReducer(products_reducer, initialState);

  const fetchProducts = async () => {
    dispatchFn({ type: "GET_PRODUCTS_BEGIN" });
    try {
      const res = await axios.get(products_url);
      const data = res.data;

      dispatchFn({ type: "GET_PRODUCTS_SUCC", payload: data });
    } catch (error) {
      dispatchFn({ type: "GET_PRODUCTS_FAIL", payload: error });
    }
  };

  const fetchSingleProduct = async (id) => {
    dispatchFn({ type: "GET_SINGLE_PRODUCT_BEGIN" });

    try {
  
      const res = await axios.get(`${single_product_url}${id}`);

      const data = res.data;
      dispatchFn({ type: "GET_SINGLE_PRODUCT_SUCC", payload: data });
    } catch (error) {
      dispatchFn({ type: "GET_SINGLE_PRODUCT_FAIL", payload: error });
    }
  };

  const contextValue = {
    products,
    productsError,
    featuredProducts,
    productsLoading,
    singleProduct,
    singleProductError,
    singleProductLoading,
    fetchSingleProduct,
  };
  useEffect(() => {
    fetchProducts(products_url);
  }, []);
  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};
export default ProductsContext;
