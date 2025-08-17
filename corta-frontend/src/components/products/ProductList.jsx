import React from "react";
import ProductItem from "./ProductItem";

function ProductList({ products, onAddToCart }) {
  return (
    <div className="row">
      {products.map((product) => (
        <div key={product.id} className="col-6 col-md-3 mb-4">
          <ProductItem product={product} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
}

export default ProductList;
