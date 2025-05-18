import React, { useState } from 'react';
import PrivacyPolicy from './PrivacyPolicy'; 
import TermsAndConditions from './TermsAndConditions';
import RefundPolicy from './RefundPolicy';
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5197/api/contactmessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('Error sending message.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "20px",
        paddingTop: "80px",
        boxSizing: "border-box",
        backgroundColor: "#f8f9fa"
      }}
    >
      <h2 className="text-center mb-4" style={{ fontFamily: 'Georgia, serif' }}>📬 Contact Us</h2>

      <div className="container" style={{ maxWidth: "900px" }}>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card p-4 shadow-sm">
              {success && (
                <div className="alert alert-success">
                  Message sent successfully!
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    name="message"
                    placeholder="Enter your message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control"
                    rows="4"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-6 d-flex flex-column justify-content-center ps-md-5 pt-2">
            <p>
              <strong>Email:</strong> support@corta.com
            </p>
            <p>
              <strong>Phone:</strong> +383 44 000 000
            </p>
          </div>
        </div>

        <footer className="mt-5 text-center text-muted">
          <a href="/terms" className="me-3">Terms and Conditions</a>
          <a href="/privacy-policy" className="me-3">Privacy Policy</a>
          <a href="refund-policy">Refund Policy</a>
        </footer>
        
      </div>
    </div>
  );
};

export default ContactForm;

