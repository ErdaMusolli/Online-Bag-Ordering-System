import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/apiClient";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    city: "",
    village: "",
    street: "",
    phone: "",
    destination: "Kosovo",
  });

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1),
    0
  );

  const shippingCost = subtotal >= 50 ? 0 : 2;
  const totalPrice = subtotal + shippingCost;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const num = value.replace(/\D/g, ""); 
      setFormData({ ...formData, [name]: num });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const currentUserId = user?.userId ?? user?.id ?? null;

const isFormValid =
  Boolean(formData.city && formData.street && formData.phone) &&
  cartItems.length > 0;

  const handleCheckout = async () => {
    if (!isFormValid) {
      setError("Please fill in all required address fields before continuing.");
      return;
    }

   if (!isAuthenticated || !currentUserId) {
    setError("Please login first!");
    setTimeout(() => navigate("/login"), 1500);
    return;
  }

    const outOfStockItems = cartItems.filter((item) => item.stock <= 0);
    if (outOfStockItems.length > 0) {
      const names = outOfStockItems.map((i) => i.productName || i.name).join(", ");
      setError(`The following items are out of stock: ${names}`);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");


    const purchaseDto = {
      userId: currentUserId,
      totalAmount: totalPrice,
      status: "Pending",
      purchaseItems: cartItems.map((item) => ({
        productId: item.productId || item.id,
        productName: item.productName || item.name || "",
        quantity: item.quantity ?? 1,
        price: item.price ?? item.product?.price ?? 0,
        productImageUrl: item.imageUrl || item.product?.imageUrl || "",
        city: formData.city,
        neighborhood: formData.village,
        street: formData.street,
        phoneNumber: formData.phone,
      })),
    };

       try {
      const res = await api.post("/purchase", purchaseDto);
      const data = res.data;
      setSuccess(`Purchase completed successfully! ID: ${data.id}`);
      setError("");

      await api.delete("/cart");
      clearCart();
      
      setTimeout(() => {
        setSuccess("");
        navigate("/store");
      }, 1500);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data ||
        err?.message ||
        "Checkout failed";
      if (err?.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          padding: "24px",
          overflowY: "auto",
          maxHeight: "90vh",
        }}
      >
        <h2 style={{ marginBottom: "24px", fontSize: "22px" }}>Checkout</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div style={{ marginBottom: "20px" }}>
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
                borderBottom: "1px solid #eee",
                paddingBottom: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
  src={
    item.imageUrl
      ? item.imageUrl.startsWith("http")
        ? item.imageUrl
        : `${API_URL}${item.imageUrl.replace("public/", "")}`
      : "/default-product.jpg"
  }
  alt={item.productName || item.name}
  style={{
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #ccc",
  }}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/default-product.jpg";
  }}
/>
                <div>
                  <p style={{ margin: 0, fontWeight: "600" }}>
                    {item.productName || item.name}
                  </p>
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    Quantity: {item.quantity ?? 1}
                  </p>
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    Unit: {(item.price ?? item.product?.price ?? 0).toFixed(2)}€
                  </p>
                </div>
              </div>
              <div style={{ fontWeight: "700" }}>
                {((item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}€
              </div>
            </div>
          ))}
          <hr style={{ margin: "12px 0" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)}€</span>
          </div>
        </div>


        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "500", display: "block", marginBottom: "6px" }}>
            Shipping Destination
          </label>
          <select
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="Kosovo">Kosovo</option>
            <option value="Albania">Albania</option>
          </select>
        </div>


        <div style={{ marginBottom: "16px" }}>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            name="village"
            placeholder="Neighborhood"
            value={formData.village}
            onChange={handleChange}
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={{
              width: "100%",
              marginBottom: "4px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <div style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
            {subtotal >= 50 ? "Shipping is free for orders over 50€" : "Shipping under 50€ is 2€"}
          </div>
        </div>


        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "700",
            fontSize: "18px",
            marginBottom: "20px",
          }}
        >
          <span>Total</span>
          <span>{totalPrice.toFixed(2)}€</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading || !isFormValid}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: loading || !isFormValid ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: loading || !isFormValid ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;