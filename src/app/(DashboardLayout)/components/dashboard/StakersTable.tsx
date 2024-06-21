/* eslint-disable @next/next/no-img-element */
"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TablePagination,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { getUserAddress } from "@/app/(DashboardLayout)/func/galiba";

interface Subscription {
  [x: string]: any;
  currentStaked: ReactNode;
  index: number;
  userDisplayName: string;
  pbg: string;
  priority: string;
  limit: any;
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
  const [userAddresses, setUserAddresses] = useState<{ [key: string]: string }>(
    {}
  );
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      const addresses: { [key: string]: string } = {};
      for (const sub of userSubs) {
        const userAddressSub = await getUserAddress(sub.fid);
        addresses[sub.subscriber] =
          userAddressSub.Socials.Social[0].connectedAddresses[0].address;
      }
      setUserAddresses(addresses);
    };

    fetchAddresses();
  }, [userSubs]);

  const handleCopyToClipboard = (text: string, subscriber: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddress(subscriber);
      setTimeout(() => {
        setCopiedAddress(null);
      }, 2000); // 2 seconds
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
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

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      userSubs
        .map((sub) => {
          const address = userAddresses[sub.subscriber] || "";
          return [...Object.values(sub), address].join(",");
        })
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "UserStakers.csv");
    document.body.appendChild(link);
    link.click();
  };
  return (
    <DashboardCard title={`Stakers (${userSubs.length})`}>
      <>
        <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
          <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}></Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    User
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Staked
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Address
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userSubs
                ?.sort((a, b) => b.userChannelAlfa - a.userChannelAlfa)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((sub, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                        <img
                          style={{ borderRadius: "50%" }}
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
                      <Typography variant="h6">{sub.currentStaked}</Typography>
                      <Typography>ALFA</Typography>
                    </TableCell>
                    <TableCell align="right">
                    <Typography
                      variant="body2"
                      onClick={() => handleCopyToClipboard(userAddresses[sub.subscriber] || "Loading...", sub.subscriber)}
                      style={{ cursor: 'pointer' }}
                    >
                      {userAddresses[sub.subscriber] || "Loading..."}
                    </Typography>
                    {copiedAddress === sub.subscriber && (
                      <Typography variant="body2" style={{ color: 'green' }}>
                        Copied
                      </Typography>
                    )}
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
        </Box>
        <Button onClick={exportToCSV} variant="contained" color="primary">
          Export as CSV
        </Button>
      </>
    </DashboardCard>
  );
};

export default ProductPerformance;
