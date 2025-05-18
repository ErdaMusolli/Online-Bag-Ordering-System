import React, { useState, useEffect } from 'react';

function ContactMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
  
    const dummyMessages = [
      { id: 1, name: 'Ardit', email: 'ardit@example.com', message: 'Përshëndetje, dua info për produktet.' },
      { id: 2, name: 'Elira', email: 'elira@example.com', message: 'Kur do të dorëzohet porosia ime?' },
    ];
    setMessages(dummyMessages);
  }, []);

  return (
    <div>
      <h2>Mesazhet e Kontaktit</h2>
      {messages.length === 0 ? (
        <p>Asnjë mesazh për tu shfaqur.</p>
      ) : (
        <ul>
          {messages.map(msg => (
            <li key={msg.id} style={{marginBottom: '1rem'}}>
              <strong>Emri:</strong> {msg.name}<br />
              <strong>Email:</strong> {msg.email}<br />
              <strong>Mesazhi:</strong> {msg.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ContactMessages;
