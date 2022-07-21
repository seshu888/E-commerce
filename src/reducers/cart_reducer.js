const reducerFn = (state, action) => {
  const { type, payload } = action;
  if (type === "ADD_TO_CART") {
    return {
      ...state,
      cartItems: payload.data,
      count:payload.count,
      total:payload.total

    };
  }
  if(type === "INCREMENT_CART_ITEM"){
    return {
        ...state,
        cartItems: payload.data,
        count:payload.count,
        total:payload.total
      };
  }
  if(type === "DECREMENT_CART_ITEM"){
    return {
        ...state,
        cartItems: payload.data,
        count:payload.count,
        total:payload.total
      };
  }
  if(type === "REMOVE_CART_ITEM"){
    return {
        ...state,
        cartItems: payload.data,
        count:payload.count,
        total:payload.total
      };
  }
};
export default reducerFn;
