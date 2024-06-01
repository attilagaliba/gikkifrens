/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
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

interface StakeChartProps {
  userSubs: Subscription[];
  userMinData: any;
  degenPrice?: number;
}

const StakeChart: React.FC<StakeChartProps> = ({ userSubs, userMinData }) => {
  // chart
  const theme = useTheme();
  const optionscolumnchart: any = {
    chart: {
      height: 450,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "18px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: false,
            label: "Total",
            formatter: function (w: any) {
              return 87448;
            },
          },
        },
      },
    },
    labels: userSubs.map((sub) => sub.channelData.title),
  };
  const seriescolumnchart = userSubs.flatMap((sub) =>
    sub.pool.poolMembers.map((member: { units: number; }) => {
      const item = sub;
      if (
        item.channelData.owner.toLowerCase() ===
        userMinData.userAddress.toLowerCase()
      ) {
        return (
          ((((member.units * 85212635) / 100 / 10000000 / 1000000) * 100) /
            (item.pool.totalUnits / 1000000)) *
          10
        ).toFixed(2);
      } else {
        return (
          ((((member.units * 100) / 70 / 10000000) * 100) /
            (item.pool.totalUnits / 1000000)) *
          10
        ).toFixed(2);
      }
    })
  );
  console.log(seriescolumnchart);
  return (
    <DashboardCard title={`Stakes (${userSubs.length})`}>
      <Chart
        options={optionscolumnchart}
        series={seriescolumnchart}
        type="radialBar"
        height={450}
        width={"100%"}
      />
    </DashboardCard>
  );
};

export default StakeChart;
