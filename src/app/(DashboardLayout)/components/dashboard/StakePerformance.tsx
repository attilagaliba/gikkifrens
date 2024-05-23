import React from "react";
import Link from "next/link";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface Subscription {
  index: number;
  userDisplayName: string;
  pbg: string;
  priority: string;
  userChannelCost: number;
  userChannelAlfa: number;
  userPfp: string;
}

interface ProductPerformanceProps {
  userSubs: Subscription[];
  limit: number;
}

const ProductPerformance: React.FC<ProductPerformanceProps> = ({
  userSubs, limit
}) => {
  function setColorAlfa(userChannelCost: number, userChannelAlfa: number) {
    const fifPerAlfa = userChannelAlfa;
    if (fifPerAlfa <= 5.99) {
      return "#A91D3A";
    } else if (fifPerAlfa >= 6 && fifPerAlfa <= 7.99) {
      return "#F3CA52";
    } else if (fifPerAlfa >= 8) {
      return "#7ABA78";
    }
  }
  return (
    <DashboardCard title={`Stakes (${userSubs.length})`}>
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                {limit !== 5000 ? ( <Link
                    href={"/stakes"}
                    sx={{
                      color: "blue",
                      textDecoration: "none",
                    }}
                  >
                    Show All
                  </Link>) : null }
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Channel
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Degen /per Alfa
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  Staked
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userSubs
              ?.sort((a, b) => b.userChannelAlfa - a.userChannelAlfa) // Sort by userChannelAlfa in descending order
              .slice(0, limit) // Get the 5th element after sorting
              .map((sub, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                      <img
                        style={{ borderRadius: "50%" }} // Apply border radius
                        src={sub.userPfp}
                        width={40}
                        height={40}
                        alt="pfp"
                      />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {sub.userDisplayName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        px: "4px",
                        backgroundColor: setColorAlfa(
                          sub.userChannelCost,
                          sub.userChannelAlfa
                        ),
                        color: "#fff",
                      }}
                      size="small"
                      label={`${sub.userChannelAlfa} DEGEN`} // Updated label
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">{sub.userChannelCost}</Typography>{" "}
                    <Typography>ALFA</Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default ProductPerformance;
