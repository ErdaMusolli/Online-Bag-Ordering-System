import React from "react";

const PrivacyPolicy = () => {
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
        backgroundColor: "#f8f9fa",
      }}
    >
      <div style={{ maxWidth: "900px", width: "100%" }}>
        <h1 className="text-center mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Privacy Policy
        </h1>

        <p className="mb-4">
          CORTA website is owned by Corta, which is a data controller of your personal data.
          <br />
          We have adopted this Privacy Policy, which determines how we are processing the information collected by CORTA,
          which also provides the reasons why we must collect certain personal data about you. Therefore, you must read
          this Privacy Policy before using CORTA website.
          <br />
          We take care of your personal data and undertake to guarantee its confidentiality and security.
        </p>

        <h2 className="h5 mb-3">Personal information we collect:</h2>
        <p className="mb-4">
          When you visit CORTA, we automatically collect certain information about your device, including your web browser,
          IP address, time zone, and some cookies. We also track the web pages or products you view, and how you interact
          with the site. We refer to this as “Device Information.” Additionally, we may collect data you provide (Name, Address,
          etc.) during registration to fulfill our services.
        </p>

        <h2 className="h5 mb-3">Why do we process your data?</h2>
        <p className="mb-4">
          Our top priority is data security. We collect minimal data as needed to maintain the website. Automatically-collected
          information helps us detect abuse and create usage statistics. You can visit without identifying yourself, but
          if you use features such as newsletters or contact forms, we may collect data such as name, email, city, and phone.
        </p>

        <h2 className="h5 mb-3">Your rights:</h2>
        <p className="mb-2">If you are a European resident, you have the following rights related to your personal data:</p>
        <ul className="mb-4 ps-4">
          <li>The right to be informed.</li>
          <li>The right of access.</li>
          <li>The right to object.</li>
          <li>The right to data portability.</li>
        </ul>

        <h2 className="h5 mb-3">Information security:</h2>
        <p className="mb-4">
          We secure your information in a controlled environment, protected against unauthorized access or disclosure.
          We apply reasonable administrative and technical safeguards. However, no internet transmission can be guaranteed
          to be 100% secure.
        </p>

        <h2 className="h5 mb-3">Contact information:</h2>
        <p className="mb-5">
          If you would like to contact us to understand more about this Policy or wish to contact us concerning any matter relating to
          individual rights and your Personal Information, you may send an email to <strong>info@corta.store</strong>.
        </p>

        <footer className="text-center text-muted border-top pt-3 pb-4">
          
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

