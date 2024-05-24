"use client";
import { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import axios from "axios";
// components
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
import RecentTransactions from "@/app/(DashboardLayout)/components/dashboard/RecentTransactions";
import ProductPerformance from "@/app/(DashboardLayout)/components/dashboard/ProductPerformance";
import StakePerformance from "@/app/(DashboardLayout)/components/dashboard/StakePerformance";
import FlowingBalance from "@/app/(DashboardLayout)/components/FlowingBalance";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import { useProfile } from "@farcaster/auth-kit";

const Dashboard = () => {
  const [userSubs, setUserSubs] = useState([]);

  const profile = useProfile();
  const {
    isAuthenticated,
    profile: { fid, displayName, custody },
  } = profile;

  const [userMinData, setUserMinData] = useState([]);
  useEffect(() => {
    const fetchData = async (fid) => {
      try {
        const response = await axios.get(`/api/getUserByFid/${fid}/`);
        setUserMinData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (fid > 0) {
      fetchData(fid);
    }
  }, [fid]);

  const [userBalanceFunc, setUserBalanceFunc] = useState<any>(null); // Hesap verilerini saklamak için state tanımı

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/getUserBalance/${userMinData.userAddress}`
        );
        setUserBalanceFunc(
          response.data.account.accountTokenSnapshots[0]
            .accountTokenSnapshotLogs[0]
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (fid > 0) {
      fetchData();
    }
  }, [userMinData]);

  useEffect(() => {
    const fetchAllData = async () => {
      let skip = 0;
      let hasMore = true;
      let allChannels = [];

      while (hasMore) {
        try {
          const response = await axios.get(
            `/api/getSubsRew/${fid}?first=${skip}`
          );
          const channels = response.data.data.map((item) => ({
            lastUpdated: item.subTs,
            userDisplayName: item.channelName,
            userPfp: item.channelPfp,
            userChannelAlfa: (item.channelApD * item.channelCost).toFixed(2),
            userChannelCost: item.channelCost,
            channelId: item.channelAddress,
          }));

          allChannels = [...allChannels, ...channels];
          hasMore = response.data.hasMore;
          skip += 50;
        } catch (error) {
          console.error("Error fetching data:", error);
          hasMore = false;
        }
      }
      setUserSubs(allChannels);
    };

    if (fid > 0) {
      fetchAllData();
    }
  }, [fid]);

  const [degenPrice, setDegenPrice] = useState(0.016);


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

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MonthlyEarnings
                  balanceArea={
                    userBalanceFunc && userBalanceFunc.balance > 0 ? (
                      <FlowingBalance
                        startingBalance={BigInt(userBalanceFunc.balance)}
                        startingBalanceDate={userBalanceFunc.timestamp}
                        flowRate={BigInt(-userBalanceFunc.totalNetFlowRate)}
                      />
                    ) : (
                      <>0000.00000</>
                    )
                  }
                  userData={userData}
                  degenPrice={degenPrice}
                />
              </Grid>
              <Grid item xs={12}>
                <YearlyBreakup userData={userData} degenPrice={degenPrice} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance
              userSubs={userSubs}
              limit={5}
              degenPrice={degenPrice}
            />
          </Grid>
          <Grid item xs={12} lg={8}>
            <StakePerformance
              userSubs={userStakes}
              limit={5}
              degenPrice={degenPrice}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions
              userRecentTransactions={userRecentTransactions}
              limit={7}
            />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
