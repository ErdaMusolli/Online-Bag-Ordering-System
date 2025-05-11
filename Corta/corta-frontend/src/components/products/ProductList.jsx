// components/products/ProductList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:7254/api/products') // URL sipas backend-it tuaj
      .then(response => setProducts(response.data))
      .catch(error => console.error('Gabim gjatë marrjes së produkteve:', error));
  }, []);

  return (
    <div>
      <h2>Lista e Produkteve</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - {product.price}€</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
