/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Clear localStorage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userProfile");

    // Redirect to login page
    router.push("/");
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <p>Logging out...</p>
    </div>
  );
}
