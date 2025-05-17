import ProductItem from "./ProductItem";

function ProductList({ products, onAddToCart }) {
  return (
    <div className="row">
      {products.map(product => (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
          <ProductItem product={product} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
}

export default ProductList;