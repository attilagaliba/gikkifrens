"use client";
import { useEffect } from "react";
import { baseDarkTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { SignInButton, useProfile } from "@farcaster/auth-kit";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = {
    rpcUrl: "https://mainnet.optimism.io",
    domain: "gikkifrens.vercel.app",
    siweUri: "https://gikkifrens.vercel.app",
  };

  return (
    <html lang="en">
      <body>
        <AuthKitProvider config={config}>
          <ThemeProvider theme={baseDarkTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AuthKitProvider>
      </body>
      <GoogleAnalytics gaId="G-4QVWNCW6ZZ" />
    </html>
  );
}
