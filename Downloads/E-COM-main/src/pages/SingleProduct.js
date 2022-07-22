import React, { useContext, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import ProductsContext from "../context/productsContext";
import { formatPrice } from "../utils/helpers";
import styled from "styled-components";
import PageHero from "../components/PageHero";
import ProductImages from "../components/ProductImages";
import AddToCart from "../components/AddToCart";

const Wrapper = styled.main`
  .back-to-products {
    color: white;
  }
  .product-center {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    padding: 2rem 0;
  }
  .price {
    color: var(--clr-primary-5);
  }
  @media (max-width:800px){
    .product-center {
      display: grid;
      width: 100%;
      grid-template-columns: 1fr ;
    }
  }
`;
const SingleProduct = () => {
  const { fetchSingleProduct, singleProduct } = useContext(ProductsContext);
  const { id } = useParams();

  useEffect(() => {
    fetchSingleProduct(id);
  }, []);

  return (
    singleProduct && (
      <Wrapper>
        <PageHero title={singleProduct.name} product={singleProduct} />
        <div className="page section-center section">
          <button type="button" className="btn">
            <Link to="/products" className="back-to-products">
              Back To Products
            </Link>
          </button>
          <div className="product-center">
            <ProductImages images={singleProduct.images} />
            <div className="product-info">
              <h2>{singleProduct.name}</h2>

              <h5 className="price"> {formatPrice(singleProduct.price)}</h5>
              <p className="desc"> {singleProduct.description}</p>
              <p className="info">
                <span>Available : </span>
                {singleProduct.stock > 0 ? "In stock" : "out of stock"}
              </p>
              <p className="info">
                <span>SKU : </span>
                {singleProduct.sku}
              </p>
              <p className="info">
                <span>Brand : </span>
                {singleProduct.company}
              </p>
              <hr />

             <AddToCart product={singleProduct} />
            </div>
          </div>
        </div>
      </Wrapper>
    )
  );
};

export default SingleProduct;
