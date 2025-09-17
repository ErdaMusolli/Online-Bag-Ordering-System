import { useState } from "react";
import api from "../../services/apiClient"; 

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null, 
    additionalImages: [], 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "additionalImages") {
        setFormData({ ...formData, additionalImages: Array.from(files) });
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (formData.image) data.append("image", formData.image);

      formData.additionalImages.forEach((file) => {
        data.append("additionalImages", file);
      });

        await api.post("/products", data);

      setSuccess("Product added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        image: null,
        additionalImages: [],
      });
    } catch (err) {
      const msg = err?.response?.data || err?.message || "Failed to add product";
      setError(typeof msg === "string" ? msg : "Failed to add product");
    }
  };


  return (
    <div className="container">
      <h2>Add a New Product</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <input
            type="text"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Main Image</label>
          <input
            type="file"
            name="image"
            className="form-control"
            onChange={handleChange}
            accept="image/*"
          />
        </div>
        <div className="mb-3">
          <label>Additional Images</label>
          <input
            type="file"
            name="additionalImages"
            className="form-control"
            multiple
            onChange={handleChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-success">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
