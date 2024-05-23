"use client";
import { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
import RecentTransactions from "@/app/(DashboardLayout)/components/dashboard/RecentTransactions";
import SubsTable from "@/app/(DashboardLayout)/components/dashboard/SubsTable";
import StakersTable from "@/app/(DashboardLayout)/components/dashboard/StakersTable";
import Blog from "@/app/(DashboardLayout)/components/dashboard/Blog";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import ChannelStats from "@/app/(DashboardLayout)/components/dashboard/ChannelStats";

const Dashboard = () => {
  const [degenPrice, setDegenPrice] = useState(0.01);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/price?fsym=DEGEN&tsyms=USD,EUR,CNY,JPY,GBP"
        );
        const result = await response.json();
        setDegenPrice(result.USD);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const userRecentTransactions = [
    { action: "withdraw", value: 1000, date: "1716325903" },
    { action: "gas", value: 18, date: "1716325889" },
    { action: "gas", value: 24, date: "1716325697" },
    { action: "deposit", value: 300, date: "1716290639" },
    { action: "gas", value: 17, date: "1716283489" },
    { action: "gas", value: 18, date: "1716220631" },
    { action: "gas", value: 21, date: "1716199015" },
  ];

  const userData = {
    userFid: 474817,
    userDisplayName: `attilagaliba`,
    userPfp: `https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/df368ec8-99d7-4485-b261-9cd4efd8f200/original`,
    userBalance: 1840.124,
    userAlfaBalance: 0,
    userAlfaClaimable: 28.602736,
    userSubs: 327,
    userSubsCost: 18000,
    userDailyAlfa: 218.23,
    userStakes: 8,
    userStakedAlfa: 2699.23,
    userStakeCashback: 18374,
    userChannelSubs: 51,
    userChannelEarnings: 6375,
  };

  const userChannel = {
    channelName: "@attilagaliba.eth",
    subscribers: 44,
    stakers: 10,
    stake: 2798,
    cost: 500,
    reward: 149.94,
    alfaDEGENX: {
      rank: 1923,
      alfa: 0.29989,
      degenx: 0.27071,
    },
    degenxAlfa: {
      rank: 3374,
      alfa: 5.503,
      degenx: 26077.173,
    },
    averageDEGENxAlfa: {
      rank: 1735,
      alfa: 2236,
      degenx: 2076,
    },
    averageAlfaStake: 475,
    totalChannels: 5418,
    totalUsers: 9266,
    totalStakers: 57615,
    totalSubscribers: 361796,
    date: "2024-05-23T14:15:00Z",
  };

  const userStakes = [
    {
      userDisplayName: "Maretus 🎩",
      userPfp:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/35379c32-956a-4d27-c8e9-4eb208270200/original",
      userChannelAlfa: 5.69,
      userChannelCost: 224.81,
    },
    {
      userDisplayName: "𝖈𝖆𝖗𝖊𝖑👽",
      userPfp:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/07df6793-935b-4e9e-57b5-5f9f4c8c3f00/original",
      userChannelAlfa: 6.02,
      userChannelCost: 156.43,
    },
    {
      userDisplayName: "attilagaliba.degen🔹🎩🔵",
      userPfp:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/df368ec8-99d7-4485-b261-9cd4efd8f200/original",
      userChannelAlfa: 6.33,
      userChannelCost: 1900.77,
    },
    {
      userDisplayName: "ohige a.k.a beardmen🎩",
      userPfp: "https://i.imgur.com/HRs0nGc.jpeg",
      userChannelAlfa: 6.57,
      userChannelCost: 197.8,
    },
    {
      userDisplayName: "Pinky Jenny 🎩🔵",
      userPfp:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/d1653339-66e1-4fcb-d891-1c2e807ffc00/original",
      userChannelAlfa: 9.46,
      userChannelCost: 111.02,
    },
  ];

  const userSubs = [
    {
      userDisplayName: "Chef 🎩",
      userPfp: "https://i.imgur.com/zpASdSb.png",
      userChannelAlfa: 256.23,
      userChannelCost: 1000,
    },
    {
      userDisplayName: "mingbada🎩",
      userPfp:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/c1d1b67a-b386-4452-51ef-c57c7c510700/rectcrop3",
      userChannelAlfa: 165,
      userChannelCost: 500,
    },
    {
      userDisplayName: "🃏agusti 🔷🐘",
      userPfp: "https://i.imgur.com/HRs0nGc.jpeg",
      userChannelAlfa: 430,
      userChannelCost: 1500,
    },
    {
      userDisplayName: "hoshino🎩⚪️🔵🟡🃏",
      userPfp:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/b8994e49-6170-4d0a-de86-843e7327fb00/original",
      userChannelAlfa: 138.65,
      userChannelCost: 500,
    },
    {
      userDisplayName: "ggang",
      userPfp:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/463b50d3-600b-4802-d8f1-336c4838b300/rectcrop3",
      userChannelAlfa: 201,
      userChannelCost: 500,
    },
    {
      userDisplayName: "Hitendra 🇮🇳🎩🔵☔",
      userPfp: "https://i.imgur.com/c7kXEdT.jpeg",
      userChannelAlfa: 150.6,
      userChannelCost: 500,
    },
  ];

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats userChannel={userChannel} title={'Subs'} userData={userData} degenPrice={degenPrice} image={"https://c.tenor.com/71rFa0hBgU4AAAAC/tenor.gif"} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats userChannel={userChannel}  title={'Stakers'} userData={userData} degenPrice={degenPrice} image={"https://media.tenor.com/Xq6Ij1fSSqMAAAAM/pepe-money.gif"} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats  userChannel={userChannel} title={'Reward'} userData={userData} degenPrice={degenPrice} image={"https://media.tenor.com/_4v3Nx_hzjwAAAAM/peepo.gif"} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats userChannel={userChannel}  title={'Stakes'} userData={userData} degenPrice={degenPrice} image={"https://c.tenor.com/KudEsy5UPSoAAAAd/tenor.gif"}  />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <SubsTable
              userSubs={userSubs}
              limit={5}
              degenPrice={degenPrice}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <StakersTable
              userSubs={userStakes}
              limit={5}
              degenPrice={degenPrice}
            />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
