import React from "react";

const RefundPolicy = () => {
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
        Returns & Refunds Policy
      </h1>

      <div className="container" style={{ maxWidth: "900px" }}>
        <p className="mb-4" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          You are entitled to cancel your order within 14 days.
          <br />
          <br />
          The deadline for canceling an order is 14 days from the date you received the goods or on
          which a third party you have appointed, who is not the carrier, takes possession of the product delivered.
          <br />
          In order to exercise your right of cancellation, you must inform us of your decision by means of a clear
          <br />
          You can inform us of your decision by e-mail <a href="mailto:support@corta.store">support@corta.store</a>
          <br />
          <br />
          We will reimburse you no later than 30 days from the day on which we receive the returned goods. We will use the same means of payment
          as you used for the order, or one that we agree upon which is suitable for all parties, and you will not incur any fees for such reimbursement.
        </p>

        <h2 className="h5 mb-3">Conditions for returns:</h2>
        <p className="mb-3" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          In order for the goods to be eligible for a return, please make sure that:
        </p>
        <ul className="mb-4" style={{ fontSize: "1.1rem" }}>
          <li>The goods were purchased in the last 14 days</li>
          <li>The goods are in the original packaging</li>
        </ul>

        <p className="mb-3" style={{ fontSize: "1.1rem" }}>
          The following goods cannot be returned:
        </p>
        <ul className="mb-4" style={{ fontSize: "1.1rem" }}>
          <li>The supply of goods made to your specifications or clearly personalized.</li>
          <li>The supply of goods which according to their nature are not suitable to be returned, for example goods which deteriorate rapidly or where the date of expiry is over.</li>
        </ul>

        <h2 className="h5 mb-3">Returning Goods</h2>
        <p className="mb-4" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          You are responsible for the cost and risk of returning the goods to us. You should send the goods to the address that we agree upon.
          <br />
          We cannot be held responsible for goods damaged or lost in return shipment. Therefore, we recommend an insured and trackable mail service.
          We are unable to issue a refund without actual receipt of the goods or proof of received return delivery.
        </p>

        <h2 className="h5 mb-3">Gifts:</h2>
        <p className="mb-4" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          If the goods were marked as a gift when purchased and then shipped directly to you, you'll receive a gift credit for the value of your return.
          Once the returned product is received, a gift certificate will be mailed to you.
          <br />
          If the goods weren't marked as a gift when purchased, or the gift giver had the order shipped to themselves to give it to you later,
          We will send the refund to the gift giver.
        </p>
      </div>

      <footer className="text-center mt-5 border-top pt-3">
        
      </footer>
    </div>
  );
};

export default RefundPolicy;
