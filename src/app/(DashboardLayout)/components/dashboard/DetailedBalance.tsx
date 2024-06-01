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
  const dataDate =
    userBalanceFuncHistory?.accountTokenSnapshots[0].accountTokenSnapshotLogs
      .map((log: { timestamp: number; }) => {
        const timestamp = log.timestamp * 1000; // Unix zaman damgasını milisaniyeye çevir
        const date = new Date(timestamp); // Unix zaman damgasını tarih nesnesine dönüştür
        // İstenilen formatta tarihi döndür ("1d ago" gibi)
        const diffTime = Math.abs(Date.now() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays}d ago`;
      })
      .reverse();

  console.log(dataDate);

  const optionscolumnchart: any = {
    chart: {
      type: "area",
      zoom: {
        enabled: false,
      },
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 500,
      sparkline: {
        enabled: false,
      },
      group: "sparklines",
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      opposite: false,
    },
    xaxis: {
      opposite: true,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    labels: dataDate,
    fill: {
      colors: [secondarylight],
      type: "straight",
      opacity: 0.1,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };
  const data =
    userBalanceFuncHistory?.accountTokenSnapshots[0].accountTokenSnapshotLogs
      .map((log: { balance: number; }) => (log.balance / 1000000000000000000).toFixed(2))
      .reverse();
  console.log(userBalanceFuncHistory);
  const seriescolumnchart: any = [
    {
      name: "DEGEN",
      color: secondary,
      data: data,
    },
  ];
  return (
    <DashboardCard
      title={`Balance | Degen = $${degenPrice}`}
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
          height={400}
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
