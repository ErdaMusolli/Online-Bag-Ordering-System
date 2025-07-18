import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Store() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:5197/api/Products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.$values || []);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });

  return (
    <div
      className="container-fluid mt-4 bg-light min-vh-100"
      style={{ paddingTop: "56px" }}
    >
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h1
          className="text-center flex-grow-1 mb-3 mb-md-0"
          style={{ fontFamily: "Libre Baskerville, serif" }}
        >
          The Boutique
        </h1>
        <select
          className="form-select form-select-sm w-auto"
          style={{ fontSize: "1.10rem", padding: "0.37rem 1.8rem", borderRadius: "1rem" }}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="asc">Lowest to Highest</option>
          <option value="desc">Highest to Lowest</option>
        </select>
      </div>

      <div className="row g-3">
        {sortedProducts.map((product) => (
          <div key={product.id} className="col-md-4">
            <div className="card p-3 h-100">
              <img
                src={`/${product.imageUrl}`}
                alt={product.name}
                className="img-fluid"
              />
              <p>{product.name}</p>
              <p>
                <strong>{product.price}€</strong>
              </p>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Store;