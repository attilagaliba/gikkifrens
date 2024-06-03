/* eslint-disable @next/next/no-img-element */
import { Box, Typography, Button } from "@mui/material";
// import img1 from 'public/images/backgrounds/rocket.png';
import Image from "next/image";
import Link from "next/link";

export const Upgrade = () => {
  return (
    <>
      <Box
        display={"flex"}
        alignItems="center"
        gap={2}
        sx={{ m: 3, p: 3, bgcolor: `${"primary.light"}`, borderRadius: "8px" }}
      >
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Image
                src="/images/profile/original.webp"
                alt="Profile Picture"
                width={50}
                height={50}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
              />
              <Box sx={{ marginLeft: "10px" }}>
                <Typography variant="body1" color="textPrimary">
                  attilagaliba.degen🔹🎩🔵
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Do you want to support?
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  href="https://warpcast.com/attilagaliba.eth/0xee205ebf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "black",
                    marginTop: "10px",
                    marginLeft: "10px",
                  }}
                >
                  <Typography variant="button" style={{ color: "green" }}>
                    Tip
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      </Box>
      <Box
        display={"flex"}
        alignItems="center"
        gap={2}
        sx={{ m: 3, p: 3, bgcolor: `${"primary.light"}`, borderRadius: "8px" }}
      >
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <img
                src="https://mint.club/_next/image?url=https%3A%2F%2Fmint-club-v2.s3.us-west-2.amazonaws.com%2F8453%2F0xF50c054089900B225fF40C336Ed693f86846Cce6%2Flogo.png%3Ft%3D1716312714772&w=128&q=75"
                alt="Profile Picture"
                width={50}
                height={50}
              />
              <Box sx={{ marginLeft: "10px" }}>
                <Typography variant="body1" color="textPrimary">
                  $GLB
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  mint on mint.club
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  href="https://mint.club/token/base/GLB"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "black",
                    marginTop: "10px",
                    marginLeft: "10px",
                  }}
                >
                  <Typography variant="button" style={{ color: "green" }}>
                    Mint
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      </Box>
    </>
  );
};
