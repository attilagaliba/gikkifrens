"use client";
import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const timestamp = 1716940353; // Your Unix timestamp
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds

  const isoDateString = date.toISOString(); // Convert date to ISO 8601 format

  console.log(); // Output: 2024-01-25T07:25:53.000Z

  return (
    <div>
      say hi
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100vh",
    fontSize: "1.2rem",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    padding: "0 20px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    minWidth: "150px",
  },
  label: {
    marginBottom: "10px",
  },
  value: {
    color: "#0070f3",
  },
};

export default App;
