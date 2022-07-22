import React, { useReducer } from "react";
import reducerFn from "../reducers/cart_reducer";

const initialState = {
  cartItems: [],
  count: 0,
  total: 0,
  shipping_fee: 534,
};
const CartContext = React.createContext({});
export const CartContextProvider = ({ children }) => {
  const [{ cartItems, count, total, shipping_fee }, dispatchFn] = useReducer(
    reducerFn,
    initialState
  );

  const getTotals = (data) => {
    let total = data.reduce((acc, item) => item.price * item.qty + acc, 0);
    let count = data.length;
    return { total, count };
  };
  const removeItem = (id) => {
    let items = [...cartItems];

    let newItems = items.filter((item) => {
      return item.id !== id;
    });
    let totals = getTotals(newItems);
    dispatchFn({
      type: "REMOVE_CART_ITEM",
      payload: { data: newItems, ...totals },
    });
  };

  const decrementCartItemQty = (id) => {
    console.log("DEC");
    let items = [...cartItems];
    console.log(items);
    let newItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, qty: item.qty - 1 };
      }
      return item;
    });
    let data = newItems.filter((item) => item.qty !== 0);

    console.log("data", data);
    let totals = getTotals(data);
    dispatchFn({ type: "DECREMENT_CART_ITEM", payload: { data, ...totals } });
  };
  const incrementCartItemQty = (id) => {
    let items = [...cartItems];
    let newItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    });
    let totals = getTotals(newItems);

    dispatchFn({
      type: "INCREMENT_CART_ITEM",
      payload: { data: newItems, ...totals },
    });
  };
  const addToCart = (color, qty, product) => {
    let items = [...cartItems];
    const newItem = {
      id: product.id,
      name: product.name,
      color,
      qty,
      image: product.images[0].url,
      price: product.price,
      max: product.stock,
    };
    items.push(newItem);
    let totals = getTotals(items);
    dispatchFn({
      type: "ADD_TO_CART",
      payload: { data: items, ...totals },
    });
  };

  const contextValue = {
    addToCart,
    cartItems,
    removeItem,
    incrementCartItemQty,
    decrementCartItemQty,
    count,
    total,
    shipping_fee
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartContext;
