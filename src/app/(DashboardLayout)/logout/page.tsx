/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userProfile");
    setTimeout(() => {
      router.push("/");
    }, 1000); // 1 saniye sonra yönlendirme yap
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <button
        style={{
          backgroundColor: "#6A5ACD",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          border: "none",
          outline: "none",
        }}
        onClick={handleLogout}
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
