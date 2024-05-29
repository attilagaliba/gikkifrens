// components/dashboard/StakePerformance.tsx

import React, { ReactNode } from "react";
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
  channelData: any;
  pool: any;
  userDisplayName: ReactNode;
  userChannelCost: number;
  userChannelAlfa: number;
  userPfp: string;
}

interface ProductPerformanceProps {
  userSubs: Subscription[];
  userMinData: any;
  limit: number;
  degenPrice?: number;
}

const ProductPerformance: React.FC<ProductPerformanceProps> = ({
  userSubs,
  userMinData,
  limit,
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
                  {limit !== 5000 ? (
                    <Link
                      href={"/stakes"}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      Show All
                    </Link>
                  ) : null}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Degen /per Alfa
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  EST. CASHBACK
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
              ?.sort((a, b) => b.userChannelAlfa - a.userChannelAlfa)
              .slice(0, limit)
              .map((sub, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {sub.channelData.title}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {(
                      (sub.channelData.estimatedEarningsPerSecond *
                        60 *
                        60 *
                        24 *
                        30) /
                      10000000000
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {sub.channelData.owner.toLowerCase() ===
                    userMinData.userAddress.toLowerCase() ? (
                      <Chip
                        sx={{
                          px: "4px",
                          backgroundColor: `purple`,
                          color: "#fff",
                        }}
                        size="small"
                        label={
                          (
                            (((((sub.channelData.estimatedEarningsPerSecond *
                              60 *
                              60 *
                              24 *
                              30) /
                              10000000000) *
                              (sub.pool.poolMembers[0].units * 94)) /
                              100 /
                              1000000) *
                              100) /
                            100
                          ).toFixed(2) + "  DEGENx"
                        }
                      />
                    ) : (
                      <Chip
                        sx={{
                          px: "4px",
                          backgroundColor: `purple`,
                          color: "#fff",
                        }}
                        size="small"
                        label={
                          (
                            (((((sub.channelData.estimatedEarningsPerSecond *
                              60 *
                              60 *
                              24 *
                              30) /
                              10000000000) *
                              (sub.pool.poolMembers[0].units * 100)) /
                              70 /
                              1000000) *
                              100) /
                            100
                          ).toFixed(2) + "  DEGENx"
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {sub.channelData.owner.toLowerCase() ===
                    userMinData.userAddress.toLowerCase() ? (
                      <Typography variant="h6">
                        {(
                          (sub.pool.poolMembers[0].units * 92.4) /
                          100 /
                          1000000
                        ).toFixed(2)}
                      </Typography>
                    ) : (
                      <Typography variant="h6">
                        {(
                          (sub.pool.poolMembers[0].units * 100) /
                          70 /
                          1000000
                        ).toFixed(2)}
                      </Typography>
                    )}
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
