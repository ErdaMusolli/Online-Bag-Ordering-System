
import React from 'react';
import UserMenu from './UserMenu';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '250px',
          height: '100vh',
          backgroundColor: '#f0f0f0',
          padding: '20px',
          boxSizing: 'border-box',
          borderRight: '1px solid #ccc',
        }}
      >
        <UserMenu />

      </header>

      <main
        style={{
          marginLeft: '250px', 
          flexGrow: 1,
          paddingTop: '80px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          boxSizing: 'border-box',
          minHeight: 'calc(100vh - 100px)', 
        }}
      >
        {children}
      </main>


      <Footer />
    </div>
  );
};

export default Layout;
