import React, { useState } from "react";

const ContactForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("access_token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7254/api/contactmessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.status === 401) {
        setErrorMessage("⚠️ You must be logged in to send a message.");
        return;
      }

      if (response.ok) {
        setSuccess(true);
        setErrorMessage("");
        setFormData({ fullName: "", email: "", message: "" });

        setTimeout(() => {
          if (onClose) onClose();
          else window.history.back();
        }, 2000);
      } else {
        setErrorMessage("Error sending message.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "60px 20px 40px",
        backgroundColor: "#fff",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: "50px",
          position: "relative",
        }}
      >
        <button
          onClick={() => (onClose ? onClose() : window.history.back())}
          style={{
            position: "absolute",
            top: "-60px",
            right: "-20px",
            background: "#fdfdfdff",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ✖
        </button>

        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: "px", fontWeight: "bold" }}>Get in touch</h3>
          <p style={{ marginBottom: "25px" }}>info@corta.store</p>

          <h3 style={{ marginBottom: "15px", fontWeight: "bold" }}>Customer support</h3>
          <p style={{ marginBottom: "25px" }}>+383 44 123 123</p>
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>Get in Touch</h2>
          <p style={{ marginBottom: "25px" }}>Contact us for any inquiries or feedback.</p>

          {errorMessage && (
            <div
              style={{
                backgroundColor: "#f8d7da",
                color: "#721c24",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "15px",
              }}
            >
              {errorMessage}
            </div>
          )}

          {success && (
            <div
              style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "15px",
              }}
            >
              Message sent successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                name="fullName"
                placeholder="Name*"
                value={formData.fullName}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="email"
                name="email"
                placeholder="Your email*"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <textarea
                name="message"
                placeholder="Message*"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: "#80836c",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
                transition: "opacity 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
