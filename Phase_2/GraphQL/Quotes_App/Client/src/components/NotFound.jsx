import React from 'react';

const NotFound = () => {
  return (
    <div
      style={{
        backgroundImage: `url("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpzY2V6cG5uZDI1OXFqeWhmYWUwM2dvcHZ4Y3dtaXBuMnRveG1wNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BFN8L8zT2VubbTYXJ8/giphy.gif")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundColor: '#000', // fallback background
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.2rem' }}>Oops! Looks like you're lost.</p>
    </div>
  );
};

export default NotFound;
