import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = token.split(".")[1];
  const decoded = JSON.parse(atob(payload));
  return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
}

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [shippingOption, setShippingOption] = useState("regular");

  const shippingCosts = { regular: 0, express: 5, nextday: 10 };

  const totalPrice =
    cartItems.reduce((sum, item) => sum + (item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1), 0) + shippingCosts[shippingOption];

  const handleCheckout = async () => {
    const userId = getUserIdFromToken();
    if (!userId) { setError("Please login first!"); setTimeout(() => navigate("/login"), 1500); return; }
    if (!cartItems || cartItems.length === 0) return setError("Your cart is empty!");
    const outOfStockItems = cartItems.filter(item => item.stock <= 0);
  if (outOfStockItems.length > 0) {
    const names = outOfStockItems.map(i => i.productName || i.name).join(", ");
    setError(`The following items are out of stock: ${names}`);
    return;
  }

    setLoading(true);
    setError("");
    setSuccess("");

    const purchaseDto = {
      userId,
      totalAmount: totalPrice,
      status: "Pending",
      shippingOption,
      purchaseItems: cartItems.map(item => ({
        productId: item.productId || item.id,
        productName: item.productName || item.name || "",
        quantity: item.quantity ?? 1,
        price: item.price ?? item.product?.price ?? 0,
        productImageUrl: item.imageUrl || item.product?.imageUrl || "",
      })),
    };

    try {
      const res = await fetch("http://localhost:5197/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(purchaseDto),
      });

      if (!res.ok) { const errorData = await res.json(); throw new Error(errorData.error || "Checkout failed"); }

      const data = await res.json();
      setSuccess(`Purchase completed successfully! ID: ${data.id}`);
      setError("");

      await fetch("http://localhost:5197/api/cart", { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

      clearCart();
      setTimeout(() => { setSuccess(""); navigate("/store"); }, 1500);

    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", backgroundColor:"#fff", display:"flex", justifyContent:"center", alignItems:"center", padding:"20px", zIndex:9999 }}>
      <div style={{ width:"100%", maxWidth:"500px", backgroundColor:"#fff", borderRadius:"12px", boxShadow:"0 4px 16px rgba(0,0,0,0.1)", padding:"24px", overflowY:"auto", maxHeight:"90vh" }}>
        <h2 style={{ marginBottom:"24px", fontSize:"22px" }}>Checkout</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div style={{ marginBottom:"20px" }}>
          {cartItems.map((item, index) => (
            <div key={index} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px", borderBottom:"1px solid #eee", paddingBottom:"8px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <img 
                  src={item.imageUrl ? (item.imageUrl.startsWith("http") ? item.imageUrl : `http://localhost:5197${item.imageUrl.replace("public/", "")}`) : "/default-product.jpg"}
                  alt={item.productName || item.name}
                  style={{ width:"80px", height:"80px", objectFit:"cover", borderRadius:"6px", border:"1px solid #ccc" }}
                  onError={(e) => { e.target.onerror = null; e.target.src="/default-product.jpg"; }}
                />
                <div>
                  <p style={{ margin:0, fontWeight:"600" }}>{item.productName || item.name}</p>
                  <p style={{ margin:0, fontSize:"14px" }}>Quantity: {item.quantity ?? 1}</p>
                  <p style={{ margin:0, fontSize:"14px" }}>Unit: {(item.price ?? item.product?.price ?? 0).toFixed(2)}€</p>
                </div>
              </div>
              <div style={{ fontWeight:"700" }}>
                {((item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}€
              </div>
            </div>
          ))}
          <hr style={{ margin:"12px 0" }} />
          <div style={{ display:"flex", justifyContent:"space-between", fontWeight:"600", fontSize:"18px" }}>
            <span>Subtotal</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </div>
        </div>

        <div style={{ marginBottom:"16px" }}>
          <label style={{ fontWeight:"500", display:"block", marginBottom:"6px" }}>Shipping destination</label>
          <select defaultValue="Kosovo" style={{ width:"100%", padding:"10px", borderRadius:"8px", border:"1px solid #ccc" }}>
            <option>Kosovo</option>
            <option>Albania</option>
          </select>
        </div>

        <div style={{ marginBottom:"16px" }}>
          <label style={{ fontWeight:"500", display:"block", marginBottom:"6px" }}>Shipping option</label>
          <select value={shippingOption} onChange={(e) => setShippingOption(e.target.value)} style={{ width:"100%", padding:"10px", borderRadius:"8px", border:"1px solid #ccc" }}>
            <option value="regular">Regular - Free</option>
            <option value="express">Express - €5</option>
            <option value="nextday">Next Day - €10</option>
          </select>
        </div>

        <div style={{ marginBottom:"16px", fontSize:"14px", color:"#555" }}>
          <p>Free shipping for orders over €70</p>
          <p>Including €{(totalPrice*0.18).toFixed(2)} in TAX (18%)</p>
        </div>

        <button 
          onClick={handleCheckout} 
          disabled={loading} 
          style={{ width:"100%", padding:"14px", fontSize:"16px", fontWeight:"bold", backgroundColor:"#007bff", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer" }}
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;