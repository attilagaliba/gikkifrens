/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { Stack, Typography, Avatar, Fab } from "@mui/material";
import cheerio from "cheerio";

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
  userAlfaBalance: any;
}

const MonthlyEarnings: React.FC<Props> = ({
  userBalanceFuncHistory,
  degenPrice,
  balanceArea,
  userAlfaBalance,
}) => {
  // chart color
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = "#f5fcff";
  const errorlight = "#fdede8";
  const [balance, setBalance] = useState("");

  // chart

  let dataDate = []; // dataDate'i boş bir dizi olarak başlatın

  if (
    userBalanceFuncHistory?.accountTokenSnapshots[0]?.accountTokenSnapshotLogs
  ) {
    dataDate =
      userBalanceFuncHistory.accountTokenSnapshots[0].accountTokenSnapshotLogs.map(
        (log: { timestamp: number }) => {
          const timestamp = log.timestamp * 1000; // Unix zaman damgasını milisaniyeye çevir
          const date = new Date(timestamp); // Unix zaman damgasını tarih nesnesine dönüştür
          // İstenilen formatta tarihi döndür ("1d ago" gibi)
          const diffTime = Math.abs(Date.now() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return `${diffDays}d ago`;
        }
      );
  }

  const updatedDataDate = [...dataDate];
  updatedDataDate.unshift("Live");

  // Sonuçları ters çevirin
  const reversedDataDate = updatedDataDate.reverse();

  // Güncellenmiş dataDate dizisini kullanarak işlemleri devam ettirin
  // ...

  const optionscolumnchart: any = {
    chart: {
      type: "area",
      zoom: {
        enabled: true,
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
    labels: updatedDataDate,
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

  // Önceden hesaplanmış verileri alın
  let data = []; // Veriyi başlat
  let reversedData = [];
  if (
    userBalanceFuncHistory &&
    userBalanceFuncHistory.accountTokenSnapshots &&
    userBalanceFuncHistory.accountTokenSnapshots[0] &&
    userBalanceFuncHistory.accountTokenSnapshots[0].accountTokenSnapshotLogs
  ) {
    // Veriyi alma işlemlerini gerçekleştir
    data =
      userBalanceFuncHistory.accountTokenSnapshots[0].accountTokenSnapshotLogs.map(
        (log: { balance: number }) =>
          (log.balance / 1000000000000000000).toFixed(2)
      );

    // Veri dizisini güncelle
    const updatedData = [...data];
    updatedData.unshift(balance); // Her güncellemede en son balance değerini en başa ekle

    // Sonuçları ters çevir
    reversedData = updatedData.reverse();

    // Devam eden işlemleri yap
    // ...
  } else {
    // Eğer veri yoksa, uygun bir işlem yap
    console.error("Veri bulunamadı.");
  }

  const seriescolumnchart: any = [
    {
      name: "DEGEN",
      color: secondary,
      data: reversedData,
    },
  ];

  useEffect(() => {
    const getBalanceFromPage = () => {
      const htmlContent = document.documentElement.innerHTML;
      const $ = cheerio.load(htmlContent);
      const balanceContent = $(".flowing-balance").text();
      setBalance(balanceContent);
    };
    const interval = setInterval(getBalanceFromPage, 5000);
    return () => clearInterval(interval);
  }, []);

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
        <Chip
          sx={{
            height: "55px",
            "& .MuiChip-label": {
              display: "block",
              whiteSpace: "normal",
            },
          }}
          label={balanceArea ? balanceArea : null}
        />
        {" <> "}
        <Chip
          sx={{
            height: "40px",
            "& .MuiChip-label": {
              display: "block",
              whiteSpace: "normal",
            },
          }}
          label={`Claimed ${
            userAlfaBalance
              ? Number((userAlfaBalance / 100000000000000).toFixed(3))
              : null
          } ALFA Ready For Stake`}
        />
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
