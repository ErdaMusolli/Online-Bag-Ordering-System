import React from "react";

const TermsAndConditions = () => {
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
      <h1 className="text-center mb-4" style={{ fontFamily: "Georgia, serif" }}>
        Terms and Conditions
      </h1>

      <div className="container" style={{ maxWidth: "900px" }}>
        <p className="mb-4">
          <strong>Welcome to CORTA!</strong> <br />
          These terms and conditions outline the rules and regulations for the use of CORTA's Website.
          By accessing this website, we assume you accept these terms and conditions.
          Do not continue to use CORTA if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="h5 mb-3">License:</h2>
        <p className="mb-3">
          Unless otherwise stated, CORTA and/or its licensors own the intellectual property rights
          for all material on CORTA. All intellectual property rights are reserved.
          You may access this from CORTA for your own personal use subjected to restrictions set in these terms and conditions.
        </p>
        <ul className="mb-4">
          <li>Copy or republish material from CORTA</li>
          <li>Sell, rent, or sub-license material from CORTA</li>
          <li>Reproduce, duplicate or copy material from CORTA</li>
          <li>Redistribute content from CORTA</li>
        </ul>

        <p className="mb-4">
          This Agreement shall begin on the date hereof.
          <br />
          <br />
          CORTA reserves the right to monitor all Comments and remove any Comments that can be considered inappropriate, offensive,
          or causes breach of these Terms and Conditions.
        </p>

        <h2 className="h5 mb-3">Content Liability:</h2>
        <p className="mb-4">
          We shall not be held responsible for any content that appears on your Website.
          You agree to protect and defend us against all claims that are raised on your Website.
          No link(s) should appear on any Website that may be interpreted as libelous, obscene, or criminal,
          or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
        </p>

        <h2 className="h5 mb-3">Reservation of Rights:</h2>
        <p className="mb-4">
          We reserve the right to request that you remove all links or any particular link to our Website.
          You approve to immediately remove all links to our Website upon request.
          We also reserve the right to amend these terms and conditions and its linking policy at any time.
          By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
        </p>

        <h2 className="h5 mb-3">Removal of links from our website:</h2>
        <p className="mb-4">
          If you find any link on our Website that is offensive for any reason, you are free to contact and inform us at any moment.
          We will consider requests to remove links, but we are not obligated to do so or to respond to you directly.
          <br />
          <br />
          We do not ensure that the information on this website is correct.
          We do not warrant its completeness or accuracy, nor do we promise to ensure that the website remains available
          or that the material on the website is kept up to date.
        </p>
      </div>

      <footer className="text-center mt-5 border-top pt-3">
        <p className="text-muted">
          © 2024 - 2025 CORTA. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default TermsAndConditions;

