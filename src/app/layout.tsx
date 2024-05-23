"use client";
import { baseDarkTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { SignInButton, useProfile } from "@farcaster/auth-kit";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = {
    rpcUrl: "https://mainnet.optimism.io",
    domain: "example.com",
    siweUri: "https://example.com/login",
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
    </html>
  );
}
