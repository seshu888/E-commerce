const products_reducer = (state, action) => {
  const { type, payload } = action;
  if (type === "GET_PRODUCTS_BEGIN") {
    return {
      ...state,
      productsLoading: false,
    };
  }
  if (type === "GET_PRODUCTS_SUCC") {
    const featured_products = payload.filter(
      (product) => product.featured === true
    );
    return {
      ...state,
      productsLoading: false,
      products: payload,
    
      featuredProducts: featured_products,
    };
  }
  if (type === "GET_PRODUCTS_FAIL") {
    return {
      ...state,
      productsLoading: false,
      productsError: payload,
    };
  }
  if (type === "GET_SINGLE_PRODUCT_BEGIN") {
    return {
...state,  singleProductLoading:true,
    }
  }
  if (type === "GET_SINGLE_PRODUCT_SUCC") {
    return {
        ...state,  singleProductLoading:false,singleProduct:payload
    }
  }
  if (type === "GET_SINGLE_PRODUCT_FAIL") {
    return {
        ...state,  singleProductLoading:false,singleProductError:payload
    }
  }

  throw new Error(`No Matching "${type}" - action type`);
};

export default products_reducer;
