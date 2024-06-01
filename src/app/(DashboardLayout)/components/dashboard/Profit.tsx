import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar } from "@mui/material";
import { IconArrowUpLeft } from "@tabler/icons-react";

import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface Props {
  degenPrice: any;
  totalAlfaAllocationPerMo: any;
  totalOutflowRate: any;
  totalEarnings: any;
  totalSubEarnings: any;
  userBalanceFunc: any;
}

const YearlyBreakup: React.FC<Props> = ({
  totalAlfaAllocationPerMo,
  totalOutflowRate,
  totalEarnings,
  totalSubEarnings,
  degenPrice,
}) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = "#ecf2ff";
  const successlight = theme.palette.success.light;

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "pie",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 300,
    },
    fill: {
      type: "image",
      opacity: 1,
      image: {
        src: [
          "https://c.tenor.com/fJxjHO7sfNAAAAAC/tenor.gif",
          "https://c.tenor.com/vaXZpS8LlM4AAAAd/tenor.gif",
        ],
        width: 50,
        imagedHeight: 50,
      },
    },
    colors: [primary, primarylight, "#F9F9FD"],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: true,
    },
    stroke: {
      width: 4,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    labels: ["Total Out", "Income"],
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const totalOut = (totalOutflowRate ?? 0) / 380517503055.17425;
  const totalProfit = (totalEarnings ?? 0) + (totalSubEarnings ?? 0);

  const seriescolumnchart: any = [totalOut ?? 0, totalProfit ?? 0];
  const dailyProfit = (totalProfit / 30).toFixed(2);

  const getDegenPrice = degenPrice ?? 1;
  const earningMo = totalProfit * getDegenPrice;

  return (
    <DashboardCard title="In / Out">
      <Grid container spacing={3}>
        <Grid item xs={7} sm={7}>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Typography variant="subtitle2" fontWeight="600">
              {totalOut.toFixed(0)}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              out / mo
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Typography variant="subtitle2" fontWeight="600">
              {totalProfit.toFixed(2)}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              in / mo
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Typography variant="subtitle2" color="textSecondary">
              out / day
            </Typography>
            <Typography variant="subtitle2" fontWeight="600">
              {(totalOut / 30).toFixed(2)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Typography variant="subtitle2" color="textSecondary">
              in / day
            </Typography>
            <Typography variant="subtitle2" fontWeight="600">
              {(totalProfit / 30).toFixed(2)}
            </Typography>
          </Stack>
        </Grid>
        {/* column */}
        <Grid item xs={5} sm={5}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="pie"
            height={150}
            width={"100%"}
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
