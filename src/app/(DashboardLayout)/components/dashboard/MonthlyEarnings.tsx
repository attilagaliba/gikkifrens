/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Fab } from "@mui/material";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface Props {
  degenPrice: any;
  userBalanceFuncHistory: any;
  balanceArea: any;
}

const MonthlyEarnings: React.FC<Props> = ({
  userBalanceFuncHistory,
  degenPrice,
  balanceArea,
}) => {
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = "#f5fcff";
  const errorlight = "#fdede8";

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "area",
      zoom: {
        enabled: false,
      },
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 150,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
    },
    dataLabels: {
      enabled: false,
    },

    yaxis: {
      opposite: true,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: "straight",
      opacity: 0.1,
    },
    markers: {
      size: 1,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };
  const seriescolumnchart: any = [
    {
      name: "DEGEN",
      color: secondary,
      data: [
        (
          userBalanceFuncHistory?.accountTokenSnapshots[0]
            .accountTokenSnapshotLogs[6].balance / 1000000000000000000
        ).toFixed(2),
        (
          userBalanceFuncHistory?.accountTokenSnapshots[0]
            .accountTokenSnapshotLogs[5].balance / 1000000000000000000
        ).toFixed(2),
        (
          userBalanceFuncHistory?.accountTokenSnapshots[0]
            .accountTokenSnapshotLogs[4].balance / 1000000000000000000
        ).toFixed(2),
        (
          userBalanceFuncHistory?.accountTokenSnapshots[0]
            .accountTokenSnapshotLogs[3].balance / 1000000000000000000
        ).toFixed(2),
        (
          userBalanceFuncHistory?.accountTokenSnapshots[0]
            .accountTokenSnapshotLogs[2].balance / 1000000000000000000
        ).toFixed(2),
        (
          userBalanceFuncHistory?.accountTokenSnapshots[0]
            .accountTokenSnapshotLogs[1].balance / 1000000000000000000
        ).toFixed(2),
        (
          userBalanceFuncHistory?.accountTokenSnapshots[0]
            .accountTokenSnapshotLogs[0].balance / 1000000000000000000
        ).toFixed(2),
      ],
    },
  ];
  return (
    <DashboardCard
      title="Balance"
      action={
        <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }}>
          <img
            width={30}
            src="https://assets.coingecko.com/coins/images/34515/standard/android-chrome-512x512.png?1706198225"
          />
        </Fab>
      }
      footer={
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="area"
          height={100}
          width={"100%"}
        />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {balanceArea ? balanceArea : null}
        </Typography>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
