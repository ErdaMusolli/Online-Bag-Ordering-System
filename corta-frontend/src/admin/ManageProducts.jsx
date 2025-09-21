import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/apiClient";

const MATERIALS = ["", "corduroy", "denim", "linen", "canvas", "bamboo", "cotton-linen", "cotton cord"];

const ASSET_HOST = "https://localhost:7254";
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${ASSET_HOST}${url.startsWith("/") ? url : `/images/${url}`}`;
};

function normalizeProduct(p) {
  const mainImage = p.imageUrl
    ? (p.imageUrl.startsWith("/") ? p.imageUrl : `/images/${p.imageUrl}`)
    : null;

  const rawImgs =
    (p.ProductImages && (Array.isArray(p.ProductImages?.$values) ? p.ProductImages.$values : p.ProductImages)) ||
    (p.productImages && (Array.isArray(p.productImages?.$values) ? p.productImages.$values : p.productImages)) ||
    [];

  const productImages = rawImgs.map((img) => {
    const url = img.imageUrl || img.url || img.path || "";
    const path = url.startsWith("/") ? url : `/${url}`;
    return { ...img, imageUrl: path };
  });

  const category = p.category || p.Category || null;
  const categoryId = p.categoryId ?? p.CategoryId ?? category?.id ?? null;
  const material = p.material ?? p.Material ?? "";

  return { ...p, imageUrl: mainImage, productImages, category, categoryId, material };
}

export default function ManageProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    oldPrice: null,
    description: "",
    stock: "",
    categoryId: "",
    material: "",
    image: null,
    additionalImages: [],
    existingImages: [],
    existingMainImage: "",
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    oldPrice: null,
    description: "",
    stock: "",
    categoryId: "",
    material: "",
    image: null,
    additionalImages: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/categories");
        const raw = Array.isArray(data) ? data : data?.$values ?? [];
        setCategories(raw);
      } catch (e) {
        console.error("Failed to load categories", e);
        setCategories([]);
      }
    })();
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const { data } = await api.get("/products");
      const list = Array.isArray(data) ? data : data?.$values ?? [];
      setProducts(list.map(normalizeProduct));
    } catch (err) {
      console.error("Error fetching products:", err?.response?.status || err?.message);
      setProducts([]);
      if (err?.response?.status === 401) navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      await loadProducts();
    } catch (err) {
      console.error("Delete failed:", err?.response?.status || err?.message);
      alert("Delete failed");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? null,
      description: product.description || "",
      stock: product.stock ?? "",
      categoryId: product.categoryId ?? product.category?.id ?? "",
      material: product.material ?? "",
      image: null,
      additionalImages: [],
      existingImages: product.productImages || [],
      existingMainImage: product.imageUrl || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    try {
      const fd = new FormData();
      fd.append("name", String(editForm.name ?? ""));
      fd.append("description", String(editForm.description ?? ""));
      fd.append("price", String(editForm.price ?? ""));
      if (editForm.oldPrice !== null && editForm.oldPrice !== undefined) {
        fd.append("oldPrice", String(editForm.oldPrice));
      }
      fd.append("stock", String(editForm.stock ?? ""));
      if (editForm.categoryId !== "" && editForm.categoryId != null) {
      fd.append("categoryId", String(editForm.categoryId));
    }
      fd.append("material", String(editForm.material ?? ""));

      if (editForm.image) {
        fd.append("image", editForm.image);
      } else if (editForm.existingMainImage) {
        fd.append("existingMainImageUrl", editForm.existingMainImage);
      }

      editForm.additionalImages.forEach((file) => fd.append("additionalImages", file));

      await api.put(`/products/${editingProduct.id}`, fd); 
      await loadProducts();
      setEditingProduct(null);
    } catch (err) {
      console.error("Update failed:", err?.response?.status || err?.message);
      alert("Update failed");
    }
  };

  const handleAdd = async () => {
    try {
      const fd = new FormData();
      fd.append("name", String(newProduct.name ?? ""));
      fd.append("description", String(newProduct.description ?? ""));
      fd.append("price", String(newProduct.price ?? ""));
      if (newProduct.oldPrice !== null && newProduct.oldPrice !== undefined) {
        fd.append("oldPrice", String(newProduct.oldPrice));
      }
      fd.append("stock", String(newProduct.stock ?? ""));
     if (newProduct.categoryId !== "" && newProduct.categoryId != null) {
      fd.append("categoryId", String(newProduct.categoryId));
    }
      fd.append("material", String(newProduct.material ?? ""));

      if (newProduct.image) fd.append("image", newProduct.image);
      newProduct.additionalImages.forEach((file) => fd.append("additionalImages", file));

      await api.post("/products", fd);
      await loadProducts();
      setShowAddModal(false);
      setNewProduct({
        name: "",
        price: "",
        oldPrice: null,
        description: "",
        stock: "",
        categoryId: "",
        material: "",
        image: null,
        additionalImages: [],
      });
    } catch (err) {
      console.error("Adding product failed:", err?.response?.status || err?.message);
      alert("Adding product failed");
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="container-fluid manage-products-container">
      <div className="d-flex flex-column flex-md-row align-items-center mb-3 gap-2">
        <button className="btn btn-outline-secondary mb-2 mb-md-0" onClick={() => navigate("/admin")}>
          ← Back
        </button>
        <h2 className="text-center flex-grow-1 m-0 mt-3 mt-md-0">Manage Products</h2>
        <button
          className="btn btn-outline-primary mt-2 mt-md-0"
          onClick={() => {
            setNewProduct({
              name: "",
              price: "",
              oldPrice: null,
              description: "",
              stock: "",
              categoryId: "",
              material: "",
              image: null,
              additionalImages: [],
            });
            setShowAddModal(true);
          }}
        >
          ➕ Add Product
        </button>
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control mb-3"
      />

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th className="d-none d-sm-table-cell">Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th className="d-none d-md-table-cell">Category</th>
              <th className="d-none d-md-table-cell">Fabric</th>
              <th className="d-none d-sm-table-cell">Main Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length ? (
              filteredProducts.map((p, i) => (
                <tr
                  key={p.id}
                  style={{
                    border: p.stock <= 0 ? "2px solid red" : "none",
                    backgroundColor: p.stock <= 0 ? "#fff5f5" : "transparent",
                  }}
                >
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td className="d-none d-sm-table-cell">{p.description}</td>
                  <td>
                    {p.oldPrice && p.oldPrice > p.price && (
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#dc3545",
                          marginRight: "5px",
                        }}
                      >
                        €{Number(p.oldPrice).toFixed(2)}
                      </span>
                    )}
                    <span style={{ fontWeight: "bold", color: "#007bff" }}>
                      €{Number(p.price).toFixed(2)}
                    </span>
                  </td>
                  <td>{p.stock}</td>
                  <td className="d-none d-md-table-cell">
                    {categories.find((c) => c.id === (p.categoryId ?? p.category?.id))?.name ||
                      p.category?.name ||
                      "-"}
                  </td>
                  <td className="d-none d-md-table-cell text-capitalize">{p.material || "-"}</td>
                  <td className="d-none d-sm-table-cell">
                    {p.imageUrl && (
                      <img
                        src={`${ASSET_HOST}${p.imageUrl}`}
                        width="50"
                        alt={p.name}
                        className="me-2"
                      />
                    )}
                    {p.productImages && p.productImages.length > 0 && (
                      <img
                        src={`${ASSET_HOST}${p.productImages[0].imageUrl}`}
                        width="50"
                        alt={`${p.name}-second`}
                      />
                    )}
                  </td>
                  <td className="d-flex gap-1 flex-wrap">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openEditModal(p)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Product</h5>
                <button className="btn-close" onClick={() => setEditingProduct(null)}></button>
              </div>
              <div className="modal-body">
                {["name", "price", "oldPrice", "description", "stock"].map((f) => (
                  <div key={f} className="mb-3">
                    <label>{f === "price" ? "Price" : f === "oldPrice" ? "Old Price" : f.charAt(0).toUpperCase() + f.slice(1)}</label>
                    <input
                      type={f === "price" || f === "stock" || f === "oldPrice" ? "number" : "text"}
                      className="form-control"
                      value={f === "price" ? editForm.price : f === "oldPrice" ? editForm.oldPrice ?? "" : editForm[f]}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          [f]: f === "oldPrice" && !e.target.value ? null : e.target.value,
                        })
                      }
                      required={f === "price" || f === "name"}
                    />
                  </div>
                ))}

               <div className="mb-3">
              <label>Category</label>
              <select
              className="form-control"
              value={editForm.categoryId ?? ""}                                  
              onChange={(e) =>
             setEditForm((f) => ({
             ...f,
              categoryId: e.target.value === "" ? "" : Number(e.target.value), 
              }))
            }
           >
            <option value="">— No category —</option>                         
           {categories.map((c) => (
           <option key={c.id} value={c.id}>
            {c.name}
           </option>
           ))}
         </select>
        </div>

                <div className="mb-3">
                  <label>Fabric</label>
                  <select
                    className="form-control"
                    value={editForm.material || ""}
                    onChange={(e) => setEditForm({ ...editForm, material: e.target.value })}
                  >
                    {MATERIALS.map((m) => (
                      <option key={m} value={m}>
                        {m || "— none —"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label>Main Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })}
                  />
                </div>

                <div className="mb-3">
                  <label>Additional Images</label>
                  <div className="d-flex mb-2 flex-wrap">
                    {editForm.existingImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={`${ASSET_HOST}${img.imageUrl}`}
                        width="50"
                        alt={`existing-${idx}`}
                        className="me-2 mb-2"
                      />
                    ))}
                  </div>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={(e) =>
                      setEditForm({ ...editForm, additionalImages: Array.from(e.target.files) })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer d-flex flex-column flex-sm-row gap-2">
                <button className="btn btn-secondary" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Add Product</h5>
                <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                {["name", "price", "oldPrice", "description", "stock"].map((f) => (
                  <div key={f} className="mb-3">
                    <label>{f === "price" ? "Price" : f === "oldPrice" ? "Old Price" : f.charAt(0).toUpperCase() + f.slice(1)}</label>
                    <input
                      type={f === "price" || f === "stock" || f === "oldPrice" ? "number" : "text"}
                      className="form-control"
                      value={f === "price" ? newProduct.price : f === "oldPrice" ? newProduct.oldPrice ?? "" : newProduct[f]}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          [f]: f === "oldPrice" && !e.target.value ? null : e.target.value,
                        })
                      }
                      required={f === "price" || f === "name"}
                    />
                  </div>
                ))}

                <div className="mb-3">
               <label>Category</label>
               <select
               className="form-control"
               value={newProduct.categoryId ?? ""}                             
               onChange={(e) =>
               setNewProduct((p) => ({
                 ...p,
               categoryId: e.target.value === "" ? "" : Number(e.target.value), 
               }))
              }
              >
               <option value="">— No category —</option>                           
               {categories.map((c) => (
               <option key={c.id} value={c.id}>
               {c.name}
               </option>
               ))}
             </select>
            </div>

                <div className="mb-3">
                  <label>Fabric</label>
                  <select
                    className="form-control"
                    value={newProduct.material || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                  >
                    {MATERIALS.map((m) => (
                      <option key={m} value={m}>
                        {m || "— none —"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label>Main Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                  />
                </div>

                <div className="mb-3">
                  <label>Additional Images</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, additionalImages: Array.from(e.target.files) })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer d-flex flex-column flex-sm-row gap-2">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAdd}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}