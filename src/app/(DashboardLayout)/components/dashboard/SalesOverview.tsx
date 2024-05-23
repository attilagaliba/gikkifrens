import React from "react";
import { Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesOverview = (userData: any) => {
  // select
  const [month, setMonth] = React.useState("1");

  const handleChange = (event: any) => {
    setMonth(event.target.value);
  };

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const totalIncome =
    userData?.userData.userChannelEarnings +
    userData?.userData.userStakeCashback;
  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "line",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "80%",
        columnWidth: "55%",
        borderRadius: [12],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },

    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    yaxis: {
      tickAmount: 10,
    },
    xaxis: {
      categories: [
        "16/08",
        "17/08",
        "18/08",
        "19/08",
        "20/08",
        "21/08",
        "22/08",
        "23/08",
      ],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart: any = [
    {
      name: "Income",
      data: [0, 0, 0, 0, 0, 0, 0, totalIncome],
    },
    {
      name: "Expense",
      data: [0, 0, 0, 0, 0, 0, 0, userData?.userData.userSubsCost],
    },
    {
        name: "Net Profit",
        data: [0, 0, 0, 0, 0, 0, 0, totalIncome - userData?.userData.userSubsCost],
      },
  ];

  return (
    <DashboardCard title="Profit">
      <Chart
        options={optionscolumnchart}
        series={seriescolumnchart}
        type="bar"
        height={400}
        width={"100%"}
      />
    </DashboardCard>
  );
};

export default SalesOverview;
