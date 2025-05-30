import { useEffect, useState } from "react";

function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const payload = token.split('.')[1];
  const decoded = JSON.parse(atob(payload));

  return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
}

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartFromBackend = async () => {
      try {
        const response = await fetch("http://localhost:5197/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        // Marrim array-in nga backend (kontrollojmë nëse ka .items.$values ose .items si array)
        const itemsArray = Array.isArray(data.items)
          ? data.items
          : data.items?.$values || [];

        setCartItems(itemsArray);

        // Llogarisim totalin duke përdorur price dhe quantity nga secili item
        if (Array.isArray(itemsArray)) {
          const total = itemsArray.reduce((sum, item) => {
            // Nëse ka field price, e marrim, ose nga product.price
            const price = Number(item.price ?? item.product?.price ?? 0);
            const quantity = Number(item.quantity ?? 1);
            return sum + price * quantity;
          }, 0);
          setTotalPrice(total);
        } else {
          setCartItems([]);
          setTotalPrice(0);
        }
      } catch (error) {
        console.error("Error while fetching the cart:", error);
      }
    };

    fetchCartFromBackend();
  }, []);

  const handleCheckout = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("User not logged in!");
      window.location.href = '/login';
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Përgatitim DTO-në me fushat që i ka cartItems sipas Cart-it
    const purchaseDto = {
      userId: userId,
      totalAmount: totalPrice,
      purchaseItems: cartItems.map(item => ({
        productName: item.productName || item.name || "",
        quantity: item.quantity || 1,
        price: item.price ?? item.product?.price ?? 0,
        productId: item.productId || item.id,
      })),
    };

    try {
      const response = await fetch('http://localhost:5197/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(purchaseDto)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      const data = await response.json();
      alert(`Purchase completed successfully! Purchase ID: ${data.id}`);

      // Pas përfundimit fshijmë cart-in në backend dhe local
      await fetch("http://localhost:5197/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setCartItems([]);
      window.location.href = '/store';

    } catch (error) {
      console.error(error);
      alert(error.message);
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
          maxWidth: "450px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          padding: "24px",
        }}
      >
        <h2 style={{ marginBottom: "24px", fontSize: "22px" }}>Checkout</h2>

        <div style={{ marginBottom: "20px" }}>
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <div>{item.productName || item.name}</div>
              <div>{((item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}€</div>
            </div>
          ))}
          <hr style={{ margin: "10px 0" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            <span>Subtotal</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "500", display: "block", marginBottom: "6px" }}>
            Shipping destination
          </label>
          <select
            defaultValue="Kosovo"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option>Kosovo</option>
            <option>Albania</option>
          </select>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontWeight: "500", display: "block", marginBottom: "6px" }}>
            Shipping option
          </label>
          <select
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option>Regular - Free</option>
          </select>
        </div>

        <button
          onClick={handleCheckout}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default Checkout;
