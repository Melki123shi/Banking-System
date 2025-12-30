import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router';

export const NotFoundPage: React.FC = () => {
  const error = useRouteError();
  
  // Logic to safely extract a message from the 'unknown' error type
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // error is from a loader/action (contains statusText or data)
    errorMessage = error.statusText || error.data?.message || 'Unknown Route Error';
  } else if (error instanceof Error) {
    // standard JS error
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = 'An unexpected error occurred';
  }

  return (
    <div style={{ 
      padding: "4rem 2rem", 
      textAlign: "center", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh"
    }}>
      <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
      <h2 style={{ marginBottom: "1.5rem" }}>Page Not Found</h2>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
    
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          marginTop: "2rem",
          padding: "0.5rem 1.5rem",
          background: "#0f3d68ff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFoundPage;