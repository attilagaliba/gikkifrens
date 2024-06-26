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
  title: string;
  number: any;
  unit: string;
  image: string;
}

const MonthlyEarnings: React.FC<Props> = ({
  title,
  number,
  unit,
  image,
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


  return (
    <DashboardCard
      title={title}
      action={
        <img style={{ borderRadius: "50%", width: "50px" }} src={image} />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {number} {unit}
        </Typography>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
