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
  userData: any;
  degenPrice: any;
}

const MonthlyEarnings: React.FC<Props> = ({ userData, degenPrice }) => {
  const [getUserData, setUserData] = useState(userData);

  useEffect(() => {
    setUserData(userData);
  }, [userData]);

  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = "#f5fcff";
  const errorlight = "#fdede8";

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "area",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: "solid",
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };
  const seriescolumnchart: any = [
    {
      name: "DEGEN",
      color: secondary,
      data: [0, 0, 0, 0, 1300, 1000, userData?.userBalance],
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
          height={60}
          width={"100%"}
        />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {getUserData?.userBalance}
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Avatar sx={{ bgcolor: errorlight, width: 27, height: 27 }}>
            {(getUserData?.userStakeCashback +
              getUserData?.userChannelEarnings -
              getUserData?.userSubsCost) /
              30 >
            0 ? (
              <IconArrowUpRight width={20} color="green" />
            ) : (
              <IconArrowDownRight width={20} color="red" />
            )}
          </Avatar>
          <Typography variant="subtitle2" fontWeight="600">
            {getUserData?.userAlfaClaimable.toFixed(6)}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Alfa
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
