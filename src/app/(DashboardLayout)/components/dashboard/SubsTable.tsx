/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  TablePagination,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import Link from "next/link";

interface Subscription {
  [x: string]: any;
  totalSubscriptionOutflowAmount: number;
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
}

const ProductPerformance: React.FC<ProductPerformanceProps> = ({
  userSubs,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      userSubs
        .map((sub) => {
          return Object.values(sub).join(",");
        })
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "userSubs.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <DashboardCard title={`Subscribers (${userSubs.length})`}>
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
          <TableHead>
            <TableRow>
              {/* <TableCell></TableCell> */}
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Channel
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  Volume
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userSubs
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                        <Link
                        target="_blank"
                          href={`https://alfafrens.com/profile/${sub.subscriber}`}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            {sub.userDisplayName}
                          </Typography>
                        </Link>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="h6">
                      {(
                        sub.totalSubscriptionOutflowAmount / 1000000000000000000
                      ).toFixed(2)}{" "}
                      Degen
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={userSubs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Button onClick={exportToCSV} variant="contained" color="primary">
          Export as CSV
        </Button>
      </Box>
    </DashboardCard>
  );
};

export default ProductPerformance;
