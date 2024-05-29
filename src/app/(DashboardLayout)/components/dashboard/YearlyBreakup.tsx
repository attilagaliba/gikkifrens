import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar } from "@mui/material";
import { IconArrowUpLeft } from "@tabler/icons-react";

import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface Props {
  userData: any;
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
  userBalanceFunc,
  userData,
  degenPrice,
}) => {
  const [getUserData, setUserData] = useState(userData);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = "#ecf2ff";
  const successlight = theme.palette.success.light;

  useEffect(() => {
    setUserData(userData);
  }, [userData]);

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, primarylight, "#F9F9FD"],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "55%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    labels: ["Stake Cashback", "Channel Earnings"],
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

  const seriescolumnchart: any = [totalEarnings ?? 0, totalSubEarnings ?? 0];

  const totalProfit =
    (totalEarnings ?? 0) +
    (totalSubEarnings ?? 0) -
    (totalOutflowRate / 380517503055.17425 ?? 0);

  const dailyProfit = (totalProfit / 30).toFixed(2);

  const getDegenPrice = degenPrice ?? 1;
  const earningMo = totalProfit * getDegenPrice;

  const dailyAlfa = getUserData?.userDailyAlfa ?? 0;

  return (
    <DashboardCard title="Net Profit">
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight="700">
            {totalProfit.toFixed(2)}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            degen / mo
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Typography variant="subtitle2" fontWeight="600">
              {dailyProfit}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              degen / daily
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Typography variant="subtitle2" fontWeight="600">
              {(totalAlfaAllocationPerMo / 30).toFixed(2)}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              alfa / daily
            </Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: primary,
                  svg: { display: "none" },
                }}
              >
                M
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                ${earningMo.toFixed(2)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: primary,
                  svg: { display: "none" },
                }}
              >
                D
              </Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                ${(earningMo / 30).toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* column */}
        <Grid item xs={5} sm={5}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            height={150}
            width={"100%"}
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
