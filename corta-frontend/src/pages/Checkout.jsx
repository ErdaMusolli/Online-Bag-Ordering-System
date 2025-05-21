import { useEffect, useState } from "react";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);

    const total = cart.reduce((sum, item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      return sum + price * qty;
    }, 0);

    setTotalPrice(total);
  }, []);

  const handleCheckout = async () => {
    // Për shembull, userId mund ta marrësh nga localStorage ose konteksti
    const userId = JSON.parse(localStorage.getItem("userId")) || 1; // zëvendëso me id reale

    // Ndërto DTO-në që backend pret
    const purchaseDto = {
  userId: userId,
  totalAmount: totalPrice,
  // mos dërgo purchaseDate sepse backend e vendos CreatedAt vetë
  purchaseItems: cartItems.map(item => ({
    productName: item.name,
    quantity: item.quantity,
    price: item.price,
    productId: item.id,  // nëse e përdor backend, nëse jo, mund ta heqësh
  })),
};

    try {
      const response = await fetch('http://localhost:5197/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseDto)
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const data = await response.json();
      alert(`Blerja u krye me sukses! ID: ${data.id}`);

      // Pas suksesi, fshij karrocën dhe ridrejto diku
      localStorage.removeItem("cart");
      setCartItems([]);
      // p.sh ridrejto te faqja kryesore ose store
      window.location.href = '/store';

    } catch (error) {
      console.error(error);
      alert('Gabim gjatë blerjes. Provo përsëri.');
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
              <div>{item.name}</div>
              <div>{(item.price * item.quantity).toFixed(2)}€</div>
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


