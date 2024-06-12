/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { styled, Container, Box, Typography, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";
import "@farcaster/auth-kit/styles.css";
import { SignInButton, useProfile } from "@farcaster/auth-kit";
import { checkUser } from "./func/galiba";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Link from "next/link";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSubMe, setIsSubMe] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    fid: 0,
    displayName: "",
    custody: {},
  });
  const [isInbannedListt, setisInbannedListt] = useState(false);

  const Login = () => {
    return <SignInButton />;
  };

  const profile = useProfile();
  const {
    isAuthenticated: profileAuthenticated,
    profile: { fid, displayName, custody },
  } = profile;

  const bannedListt = {
    values: [0],
  };

  useEffect(() => {
    const fetchData = async (fid: number) => {
      const userData = await checkUser(userProfile.fid);
      const checkbannedListt = bannedListt.values.includes(userProfile.fid);
      setisInbannedListt(checkbannedListt);
      setIsSubMe(true);
    };

    if (userProfile && userProfile.fid > 0) {
      fetchData(userProfile.fid);
    }
  }, [userProfile]);

  useEffect(() => {
    if (profileAuthenticated) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "userProfile",
        JSON.stringify({ fid, displayName, custody })
      );
      if (fid && fid > 0 && displayName && custody) {
        setUserProfile({ fid, displayName, custody });
      }
    } else {
      const storedAuth = localStorage.getItem("isAuthenticated");
      const storedProfile = localStorage.getItem("userProfile");

      if (storedAuth === "true" && storedProfile) {
        setIsAuthenticated(true);
        const parsedProfile = JSON.parse(storedProfile);
        setUserProfile(parsedProfile);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userProfile");
      }
    }
  }, [profileAuthenticated, fid, displayName, custody]);

  const CustomLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    color: "inherit",
  }));

  return (
    <MainWrapper className="mainwrapper">
      <Analytics />
      <SpeedInsights />
      {isAuthenticated && !isInbannedListt && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
      )}

      {isAuthenticated ? (
        isSubMe ? (
          !isInbannedListt ? (
            <PageWrapper className="page-wrapper">
              <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />

              <Container
                sx={{
                  paddingTop: "20px",
                  maxWidth: "1200px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
                <Box
                  component="footer"
                  sx={{
                    width: "100%",
                    maxWidth: "1200px",
                    padding: "20px 0",
                    borderTop: "1px solid #e0e0e0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    marginTop: "20px",
                  }}
                >
                  <Box
                    sx={{ display: "flex", gap: "15px", marginBottom: "10px" }}
                  >
                    <CustomLink
                      href="/"
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      Dashboard
                    </CustomLink>
                    <CustomLink
                      href="/channel"
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      Your Channel
                    </CustomLink>
                    <CustomLink
                      href="/subs"
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      Subscriptions
                    </CustomLink>
                    <CustomLink
                      href="/stakes"
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      Stakes
                    </CustomLink>
                    <CustomLink
                      href="/details"
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      Details
                    </CustomLink>
                    <CustomLink
                      href="/ai"
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      AiFren
                    </CustomLink>
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: "10px" }}
                  >
                    <b>GikkiFrens</b> made by{" "}
                    <CustomLink
                      href="https://warpcast.com/attilagaliba.eth"
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      @attilagaliba
                    </CustomLink>{" "}
                    with 💜 and 🐘
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: "10px" }}
                  >
                    You need Sub{" "}
                    <CustomLink
                      href="https://www.alfafrens.com/channel/0x35dfccae83f23a7f91c0e4ff27d323fc161baca7"
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      @DegenFans
                    </CustomLink>{" "}
                    for channel Alfa Allocation
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    V0.7 Early Alpha
                  </Typography>
                </Box>
              </Container>
            </PageWrapper>
          ) : (
            <PageWrapper className="page-wrapper">
              <Container
                sx={{
                  paddingTop: "20px",
                  maxWidth: "1200px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src="/images/logos/alfaLogo.png"
                  alt="Logo"
                  style={{
                    marginBottom: "50px",
                    width: "300px",
                    height: "auto",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    minHeight: "calc(100vh - 170px)",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      textAlign: "center",
                      backgroundColor: "#f9f9f9",
                      padding: "20px",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <img
                      src="https://c.tenor.com/Z2TdtasP_b0AAAAd/tenor.gif"
                      alt="Profile Picture"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        marginBottom: "20px",
                      }}
                    />
                    <Typography variant="h6" color="textPrimary">
                      Hello Fren
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      gutterBottom
                    >
                      you are banned
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      href="https://warpcast.com/attilagaliba.eth/0xee205ebf"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ backgroundColor: "black", marginTop: "20px" }}
                    >
                      <Typography variant="button" sx={{ color: "green" }}>
                        ask me why
                      </Typography>
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      maxWidth: "300px",
                      marginTop: "20px",
                    }}
                  >
                    <CustomLink
                      target="_blank"
                      href="https://warpcast.com/attilagaliba.eth"
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      @attilagaliba
                    </CustomLink>
                    <Typography variant="body2" color="textSecondary">
                      V0.7 Early Alpha
                    </Typography>
                  </Box>
                </Box>
              </Container>
            </PageWrapper>
          )
        ) : (
          <PageWrapper className="page-wrapper">
            <Container
              sx={{
                paddingTop: "20px",
                maxWidth: "1200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  minHeight: "calc(100vh - 170px)",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/images/logos/alfaLogo.png"
                  alt="Logo"
                  style={{
                    marginBottom: "50px",
                    width: "300px",
                    height: "auto",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <img
                    src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/df368ec8-99d7-4485-b261-9cd4efd8f200/original"
                    alt="Profile Picture"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      marginBottom: "20px",
                    }}
                  />
                  <Typography variant="h6" color="textPrimary">
                    attilagaliba.degen🔹🎩🔵
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    gutterBottom
                  >
                    Please Subscribe to me
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    href="https://www.alfafrens.com/channel/0x27bf87dcaf7121715ac6b8addf2085a62be7ea0d"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ backgroundColor: "black", marginTop: "20px" }}
                  >
                    <Typography variant="button" sx={{ color: "green" }}>
                      Subscribe for 500 DEGENx/mo
                    </Typography>
                  </Button>
                  <Typography variant="body2" color="textSecondary">
                    If you are a subscriber and still cannot see it, try logging
                    in with other addresses.
                  </Typography>
                  <CustomLink
                    target="_blank"
                    href="https://gikkifrens.vercel.app/"
                    sx={{ textDecoration: "none", color: "textSecondary" }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      https://gikkifrens.vercel.app/
                    </Typography>
                  </CustomLink>
                  <CustomLink
                    target="_blank"
                    href="https://frens.gikkilab.com/"
                    sx={{ textDecoration: "none", color: "textSecondary" }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      https://frens.gikkilab.com/
                    </Typography>
                  </CustomLink>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    maxWidth: "300px",
                    marginTop: "20px",
                  }}
                >
                  <CustomLink
                    target="_blank"
                    href="https://warpcast.com/attilagaliba.eth"
                    sx={{ textDecoration: "none", color: "inherit" }}
                  >
                    @attilagaliba
                  </CustomLink>
                  <Typography variant="body2" color="textSecondary">
                    V0.7 Early Alpha
                  </Typography>
                </Box>
              </Box>
            </Container>
          </PageWrapper>
        )
      ) : (
        <PageWrapper className="page-wrapper">
          <Container
            sx={{
              paddingTop: "20px",
              maxWidth: "1200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                minHeight: "calc(100vh - 170px)",
                justifyContent: "center",
              }}
            >
              <img
                src="/images/logos/alfaLogo.png"
                alt="Logo"
                style={{ marginBottom: "50px", width: "300px", height: "auto" }}
              />
              <Typography variant="h4" gutterBottom>
                AlfaFrens Detailed Dashboard
              </Typography>
              <Typography variant="body1" gutterBottom>
                Love Cats, Degen, Bleu, Farcaster and Alfafrens
              </Typography>
              <Box sx={{ marginTop: "30px", marginBottom: "30px" }}>
                <SignInButton />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  maxWidth: "300px",
                }}
              >
                <CustomLink
                  target="_blank"
                  href="https://warpcast.com/attilagaliba.eth"
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  @attilagaliba
                </CustomLink>
                <Typography variant="body2" color="textSecondary">
                  V0.7 Early Alpha
                </Typography>
              </Box>
            </Box>
          </Container>
        </PageWrapper>
      )}
    </MainWrapper>
  );
}
