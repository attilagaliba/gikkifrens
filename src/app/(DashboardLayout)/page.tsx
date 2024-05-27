// app/page.tsx

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

import {
  getUserTrasfers,
  getUserByFid,
  getUserBalance,
  getSubsRew,
} from "./func/galiba";

import { useProfile } from "@farcaster/auth-kit";

const Dashboard = () => {
  const [userMinData, setUserMinData] = useState<any>([]);
  const [userBalanceFunc, setUserBalanceFunc] = useState<any>(null);
  const [userSubs, setUserSubs] = useState<any[]>([]);
  const [degenPrice, setDegenPrice] = useState<number | undefined>(0.016);

  const [userRecentTransactions, setUserRecentTransactions] = useState<any[]>(
    []
  );

  const profile = useProfile();
  const {
    isAuthenticated,
    profile: { fid, displayName, custody },
  } = profile;

  useEffect(() => {
    const fetchData = async (fid: number) => {
      const userData = await getUserByFid(fid);
      setUserMinData(userData);
    };

    if (fid && fid > 0) {
      fetchData(fid);
    }
  }, [fid]);

  useEffect(() => {
    const fetchData = async () => {
      if (userMinData && userMinData.userAddress) {
        const userBalance = await getUserBalance(userMinData.userAddress);
        setUserBalanceFunc(userBalance);
      }
    };

    fetchData();
  }, [userMinData]);


  ///Transfers
  useEffect(() => {
    const fetchData = async () => {
      if (userMinData && userMinData.userAddress) {
        const userTransfers = await getUserTrasfers(userMinData.userAddress);
        const accountData = userTransfers.data.account;
        const mergedTransfers = [
          ...accountData.receivedTransferEvents.map((event: { value: string; timestamp: any; }) => ({
            action: "deposit",
            value: parseFloat(event.value) / 10 ** 18, // Ethereum'da değeri ETH'ye çevirmek için
            date: event.timestamp || null, // Eğer timestamp yoksa null
          })),
          ...accountData.sentTransferEvents
            .filter(
              (event: { to: { id: string; }; }) =>
                event.to.id === "0xf3aaefee7ec04fe3757733290b318f1748bb0852" ||
                event.to.id === "0x0000000000000000000000000000000000000000"
            )
            .map((event: { to: { id: string; }; value: string; timestamp: any; }) => ({
              action:
                event.to.id === "0xf3aaefee7ec04fe3757733290b318f1748bb0852"
                  ? "gas"
                  : "withdraw",
              value: parseFloat(event.value) / 10 ** 18, // Ethereum'da değeri ETH'ye çevirmek için
              date: event.timestamp || null, // Eğer timestamp yoksa null
            })),
        ];
        const sortedTransfers = mergedTransfers.sort(
          (a, b) => (b.date || 0) - (a.date || 0)
        );

        setUserRecentTransactions(sortedTransfers);
      }
    };

    fetchData();
  }, [userMinData]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (fid && fid > 0) {
        const allChannels = await getSubsRew(fid);
        if (typeof allChannels === "number") {
          // getSubsRew fonksiyonundan dönen değer uygun değilse, hata işleme alınabilir
        } else {
          // allChannels değişkeni uygun bir değer döndüğünde setUserSubs ile güncelleme yapılır
          setUserSubs(allChannels);
        }
      }
    };
    
    if (fid && fid > 0) {
      fetchAllData();
    }
  }, [fid]);

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
            {userSubs.length > 0 ? (
              <ProductPerformance
                userSubs={userSubs}
                limit={5}
                degenPrice={degenPrice}
              />
            ) : (
              <>Loading Your Sub List</>
            )}
          </Grid>
          <Grid item xs={12} lg={8}>
            <StakePerformance
              userSubs={userStakes}
              limit={5}
              degenPrice={degenPrice}
            />
          </Grid>
          {userRecentTransactions.length > 0 ? (
            <Grid item xs={12} lg={4}>
              <RecentTransactions
                userRecentTransactions={userRecentTransactions}
                limit={10}
              />
            </Grid>
          ) : (
            <Grid item xs={12} lg={4}>
              Loading
            </Grid>
          )}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
