
const API_URL = "http://localhost:5197/api/products"; 

export const fetchProducts = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

export const createProduct = async (product) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });
  return await response.json();
};

