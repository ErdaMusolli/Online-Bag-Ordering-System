import { useEffect, useContext } from "react";
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

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1),
    0
  );

  useEffect(() => {
    const fetchCartFromBackend = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in.");
        window.location.href = "/login";
        return;
      }

  try {
        const res = await fetch("http://localhost:5197/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        console.log("Fetched cart:", data);

      } catch (err) {
        console.error("Error fetching cart:", err);
        alert("Could not fetch cart. Please login again.");
        window.location.href = "/login";
      }
    };

    fetchCartFromBackend();
  }, []);

    const handleCheckout = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("User not logged in!");
      window.location.href = "/login";
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
       const purchaseDto = {
      userId,
      totalAmount: totalPrice,
      purchaseItems: cartItems.map(item => ({
        productName: item.productName || item.name || "",
        quantity: item.quantity ?? 1,
        price: item.price ?? item.product?.price ?? 0,
        productId: item.productId || item.id,
        productImageUrl: item.imageUrl || item.product?.imageUrl || ""
      })),
    };

    try {
      const res = await fetch("http://localhost:5197/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(purchaseDto),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Checkout failed");
      }

      const data = await res.json();
      alert(`Purchase completed! ID: ${data.id}`);

      await fetch("http://localhost:5197/api/cart", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      clearCart();
      window.location.href = "/store";

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", backgroundColor:"#fff", display:"flex", justifyContent:"center", alignItems:"center", padding:"20px", zIndex:9999 }}>
      <div style={{ width:"100%", maxWidth:"450px", backgroundColor:"#fff", borderRadius:"12px", boxShadow:"0 4px 16px rgba(0,0,0,0.1)", padding:"24px" }}>
        <h2 style={{ marginBottom:"24px", fontSize:"22px" }}>Checkout</h2>

        <div style={{ marginBottom:"20px" }}>
          {cartItems.map((item, index) => (
            <div key={index} style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
              <div>{item.productName || item.name}</div>
              <div>{((item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}€</div>
            </div>
          ))}
          <hr style={{ margin:"10px 0" }} />
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

        <div style={{ marginBottom:"24px" }}>
          <label style={{ fontWeight:"500", display:"block", marginBottom:"6px" }}>Shipping option</label>
          <select style={{ width:"100%", padding:"10px", borderRadius:"8px", border:"1px solid #ccc" }}>
            <option>Regular - Free</option>
          </select>
        </div>

        <button onClick={() => handleCheckout(cartItems, clearCart, totalPrice)} style={{ width:"100%", padding:"14px", fontSize:"16px", fontWeight:"bold", backgroundColor:"#007bff", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer" }}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default Checkout;
