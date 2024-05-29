/* eslint-disable @next/next/no-img-element */
"use client";
import { styled, Container, Box, Typography, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";
import "@farcaster/auth-kit/styles.css";
import { SignInButton, useProfile } from "@farcaster/auth-kit";
import { checkUser } from "./func/galiba";

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
  const [isSubMe, setIsSubMe] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    fid: 0,
    displayName: "",
    custody: {},
  });
  const [isInEarlyList, setisInEarlyList] = useState(false);

  const Login = () => {
    return <SignInButton />;
  };

  const profile = useProfile();
  const {
    isAuthenticated: profileAuthenticated,
    profile: { fid, displayName, custody },
  } = profile;

  const earlyList = {
    values: [1474817, 474817, 42352354, 324234, 2354, 43],
  };

  // Check if fid exists in earlyList

  useEffect(() => {
    const fetchData = async (fid: number) => {
      const userData = await checkUser(userProfile.fid);
      const checkEarlyList = earlyList.values.includes(userProfile.fid);
      setisInEarlyList(checkEarlyList);
      setIsSubMe(userData);
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
      setUserProfile({ fid, displayName, custody });
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

  return (
    <MainWrapper className="mainwrapper">
      {isAuthenticated && isInEarlyList && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
      )}

      {isAuthenticated ? (
        isSubMe ? (
          isInEarlyList ? (
            <PageWrapper className="page-wrapper">
              <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />

              <Container
                sx={{
                  paddingTop: "20px",
                  maxWidth: "1200px",
                }}
              >
                <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
              </Container>
            </PageWrapper>
          ) : (
            <PageWrapper className="page-wrapper">
              <Container
                sx={{
                  paddingTop: "20px",
                  maxWidth: "1200px",
                }}
              >
                <Box
                  sx={{
                    minHeight: "calc(100vh - 170px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src="https://c.tenor.com/Z2TdtasP_b0AAAAd/tenor.gif"
                      alt="Profile Picture"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                    <Box sx={{ marginLeft: "20px" }}>
                      <Typography variant="body1" color="textPrimary">
                        Hello Fren
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        You are not in the Early Access Lists
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        href="https://warpcast.com/attilagaliba.eth/0xf30380cc"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ backgroundColor: "black", marginTop: "10px" }}
                      >
                        <Typography variant="button" style={{ color: "green" }}>
                          Join to early access
                        </Typography>
                      </Button>
                    </Box>
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
              }}
            >
              <Box
                sx={{
                  minHeight: "calc(100vh - 170px)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/df368ec8-99d7-4485-b261-9cd4efd8f200/original"
                    alt="Profile Picture"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                  <Box sx={{ marginLeft: "20px" }}>
                    <Typography variant="body1" color="textPrimary">
                      attilagaliba.degen🔹🎩🔵
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Please Subscribe to me
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      href="https://www.alfafrens.com/channel/0x27bf87dcaf7121715ac6b8addf2085a62be7ea0d"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ backgroundColor: "black", marginTop: "10px" }}
                    >
                      <Typography variant="button" style={{ color: "green" }}>
                        Subscribe for 500 DEGENx/mo
                      </Typography>
                    </Button>
                  </Box>
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
            }}
          >
            <Box
              sx={{
                minHeight: "calc(100vh - 170px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SignInButton />
            </Box>
          </Container>
        </PageWrapper>
      )}
    </MainWrapper>
  );
}
