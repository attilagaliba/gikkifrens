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
    values: [
      447766, 474817, 479063, 385955, 253127, 306610, 536200, 9507, 289702,
      1631, 4282, 4865, 8152, 8685, 19129, 196411, 323583, 343400, 354894,
      366713, 385469, 444517, 446697, 310124, 426875, 324115, 369769, 466946,
      568047, 427685, 17474, 278653, 4549, 239709, 268992, 277700, 320189,
      408746, 237778, 395461, 576740, 253127, 403619, 12021, 296785, 269385,
      2904, 382254, 449282, 214570, 409852, 351282, 263685, 488644, 2904,
    ],
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
                <Link href={"/"}>Dashboard</Link> |{" "}
                <Link href={"/channel"}>Your Channel</Link> |{" "}
                <Link href={"/subs"}>Subscriptions</Link> |{" "}
                <Link href={"/stakes"}>Stakes</Link> |{" "}
                <Link href={"/ai"}>AiFren</Link> | 🟣 made by @attilagaliba with
                💜 | You need Sub{" "}
                <Link
                  href={
                    "https://www.alfafrens.com/channel/0x35dfccae83f23a7f91c0e4ff27d323fc161baca7"
                  }
                >
                  @DegenFans
                </Link>{" "}
                for channel Alfa Allocation | Version: toooooooMuchAlpha
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
