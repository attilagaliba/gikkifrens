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
  userChannel: any;
  title: string;
  userData: any;
  degenPrice: any;
}

const MonthlyEarnings: React.FC<Props> = ({
  userChannel,
  title,
  userData,
  degenPrice,
}) => {
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

  function getData(title: string) {
    if (title === "Subs") {
      return userChannel.subscribers;
    } else if (title === "Stakers") {
      return `${userChannel.stakers}`;
    } else if (title === "Reward") {
      return `${userChannel.reward} ALFA`;
    } else if (title === "Stakes") {
      return `${userChannel.stake} DEGEN`;
    }
  }

  return (
    <DashboardCard
      title={title}
      action={
        <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }}>
          <img
            width={30}
            src="https://assets.coingecko.com/coins/images/34515/standard/android-chrome-512x512.png?1706198225"
          />
        </Fab>
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {getData(title)}
        </Typography>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
