import React, { useState } from "react";

const ContactForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);

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
      const response = await fetch("http://localhost:5197/api/contactmessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ fullName: "", email: "", message: "" });
      } else {
        alert("Error sending message.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      window.history.back(); 
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
        position: "relative",
      }}
    >
      <button
        onClick={handleBack}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          backgroundColor: "#80836c",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          padding: "8px 14px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "opacity 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.target.style.opacity = "1")}
      >
        ← Back
      </button>

      <div
        style={{
          maxWidth: "1000px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: "50px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: "15px", fontWeight: "bold" }}>Get in touch</h3>
          <p style={{ marginBottom: "25px" }}>info@corta.store</p>

          <h3 style={{ marginBottom: "15px", fontWeight: "bold" }}>Customer support</h3>
          <p style={{ marginBottom: "25px" }}>+383 4* *** ***</p>
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>Get in Touch</h2>
          <p style={{ marginBottom: "25px" }}>Contact us for any inquiries or feedback.</p>

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
              />
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
