/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useState } from "react";
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
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import LinearProgress from "@mui/material/LinearProgress";
import { CSVLink } from "react-csv";

interface Subscription {
  channelData: any;
  pool: any;
  orderBy: any;
  userDisplayName: ReactNode;
  userChannelCost: number;
  userChannelAlfa: number;
  userPfp: string;
}

interface StakePerformanceProps {
  userSubs: Subscription[];
  userMinData: any;
  degenPrice?: number;
}

const StakePerformance: React.FC<StakePerformanceProps> = ({
  userSubs,
  userMinData,
}) => {
  type OrderBy = "channelData.title" | "userChannelAlfa" | "userChannelCost";

  const [orderBy, setOrderBy] = useState<OrderBy>("userChannelAlfa");

  const [order, setOrder] = useState<any>("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [csvData, setCsvData] = React.useState<
    {
      Channel: any;
      "Degen /per Alfa": string;
      "EST. CASHBACK": string;
      Staked: string;
    }[]
  >([]);

  const prepareCsvData = () => {
    const data = userSubs.map((sub) => ({
      Channel: sub.channelData.title,
      "Degen /per Alfa": (
        (sub.channelData.estimatedEarningsPerSecond * 60 * 60 * 24 * 30) /
        10000000000
      ).toFixed(2),
      "EST. CASHBACK":
        (
          ((((sub.channelData.estimatedEarningsPerSecond * 60 * 60 * 24 * 30) /
            10000000000) *
            (sub.pool.poolMembers[0].units *
              (sub.channelData.owner.toLowerCase() ===
              userMinData.userAddress.toLowerCase()
                ? 94
                : 100))) /
            (sub.channelData.owner.toLowerCase() ===
            userMinData.userAddress.toLowerCase()
              ? 100
              : 70) /
            1000000) *
          100
        ).toFixed(2) + " DEGENx",
      Staked:
        (
          (sub.pool.poolMembers[0].units *
            (sub.channelData.owner.toLowerCase() ===
            userMinData.userAddress.toLowerCase()
              ? 92.4
              : 100)) /
          (sub.channelData.owner.toLowerCase() ===
          userMinData.userAddress.toLowerCase()
            ? 100
            : 70) /
          1000000
        ).toFixed(2) + " ALFA",
    }));
    setCsvData(data);
  };

  React.useEffect(() => {
    prepareCsvData();
  }, [userSubs]);

  React.useEffect(() => {
    prepareCsvData();
  }, [userSubs]);

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const sortedSubs = userSubs.slice().sort((a, b) => {
    const isAsc = order === "asc" ? 1 : -1;
    if (orderBy === "channelData.title") {
      if (a.channelData.title < b.channelData.title) return -1 * isAsc;
      if (a.channelData.title > b.channelData.title) return 1 * isAsc;
      return 0;
    }
    if (orderBy === "userChannelAlfa") {
      // Assuming userChannelAlfa is a number
      if (a.userChannelAlfa < b.userChannelAlfa) return -1 * isAsc;
      if (a.userChannelAlfa > b.userChannelAlfa) return 1 * isAsc;
      return 0;
    }
    if (orderBy === "userChannelCost") {
      // Assuming userChannelCost is a number
      if (a.userChannelCost < b.userChannelCost) return -1 * isAsc;
      if (a.userChannelCost > b.userChannelCost) return 1 * isAsc;
      return 0;
    }
    // Default case
    return 0;
  });

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, userSubs.length - page * rowsPerPage);

  return (
    <DashboardCard title={`Stakes (${userSubs.length})`}>
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "channelData.title"}
                  direction={orderBy === "channelData.title" ? order : "asc"}
                  onClick={() => handleRequestSort("channelData.title")}
                >
                  Channel
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "userChannelAlfa"}
                  direction={orderBy === "userChannelAlfa" ? order : "asc"}
                  onClick={() => handleRequestSort("userChannelAlfa")}
                >
                  Degen /per Alfa
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  EST. CASHBACK
                </Typography>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "userChannelCost"}
                  direction={orderBy === "userChannelCost" ? order : "asc"}
                  onClick={() => handleRequestSort("userChannelCost")}
                >
                  Staked
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          {userSubs && userSubs.length > 0 ? (
            <TableBody>
              {sortedSubs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((sub, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box>
                          <Link
                            rel="noopener noreferrer"
                            target="_blank"
                            href={`https://www.alfafrens.com/channel/${sub.channelData.id}`}
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              {sub.channelData.title}
                            </Typography>
                          </Link>
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
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
          ) : (
            <>
              <LinearProgress color="secondary" />
              <LinearProgress color="success" />
              <LinearProgress color="inherit" />
            </>
          )}
        </Table>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <CSVLink data={csvData} filename={"StakesFromGikkiFrens.csv"}>
            Export
          </CSVLink>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={userSubs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default StakePerformance;
