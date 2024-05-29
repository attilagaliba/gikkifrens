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
  getUserStakedList,
  getUserBalance,
  getUserBalanceHistory,
  getSubsRew,
  fetchChannelData,
  getUserSubscribedChannels,
} from "./func/galiba";

const Dashboard = () => {
  const [userMinData, setUserMinData] = useState<any>([]);
  const [userBalanceFunc, setUserBalanceFunc] = useState<any>(null);
  const [userBalanceFuncHistory, setUserBalanceHistoryFunc] =
    useState<any>(null);

  const [updatedUserStakedList, setUpdatedUserStakedList] = useState<any[]>([]);

  const [userSubsAlfafrens, setUserSubsAlfafrens] = useState<any[]>([]);
  const [userSubsDegenFans, setUserSubsDegenfans] = useState<any[]>([]);
  const [updatedUserSubsAlfafrens, setUpdatedUserSubsAlfafrens] = useState<
    any[]
  >([]);
  const [totalAlfaAllocationPerMo, setTotalAlfaAllocationPerMo] = useState(0);

  const [degenPrice, setDegenPrice] = useState<number | undefined>(0.016);

  const [userRecentTransactions, setUserRecentTransactions] = useState<any[]>(
    []
  );

  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSubEarnings, setTotalSubEarnings] = useState(0);

  const [fid, setFid] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [custody, setCustody] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://li.quest/v1/token?chain=8453&token=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
        );
        const result = await response.json();
        setDegenPrice(parseFloat(parseFloat(result.priceUSD).toFixed(4)));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    const storedProfile = localStorage.getItem("userProfile");
    if (storedIsAuthenticated && storedProfile) {
      const profile = JSON.parse(storedProfile);
      setFid(profile.fid);
      setDisplayName(profile.displayName);
      setCustody(profile.custody);
    }
  }, []);
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
        const userBalanceHistory = await getUserBalanceHistory(
          userMinData.userAddress
        );
        setUserBalanceFunc(userBalance);
        setUserBalanceHistoryFunc(userBalanceHistory);
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
          ...accountData.receivedTransferEvents.map(
            (event: { value: string; timestamp: any }) => ({
              action: "deposit",
              value: parseFloat(event.value) / 10 ** 18, // Ethereum'da değeri ETH'ye çevirmek için
              date: event.timestamp || null, // Eğer timestamp yoksa null
            })
          ),
          ...accountData.sentTransferEvents
            .filter(
              (event: { to: { id: string } }) =>
                event.to.id === "0xf3aaefee7ec04fe3757733290b318f1748bb0852" ||
                event.to.id === "0x0000000000000000000000000000000000000000"
            )
            .map(
              (event: {
                to: { id: string };
                value: string;
                timestamp: any;
              }) => ({
                action:
                  event.to.id === "0xf3aaefee7ec04fe3757733290b318f1748bb0852"
                    ? "gas"
                    : "withdraw",
                value: parseFloat(event.value) / 10 ** 18, // Ethereum'da değeri ETH'ye çevirmek için
                date: event.timestamp || null, // Eğer timestamp yoksa null
              })
            ),
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
    const fetchData = async () => {
      try {
        const allChannelsAlfaFrens = await getUserSubscribedChannels(fid);
        setUserSubsAlfafrens(allChannelsAlfaFrens);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (fid > 0) {
      fetchData();
    }
  }, [fid]);

  useEffect(() => {
    const fetchAllData = async () => {
      const allChannelsDegenFans = await getSubsRew(fid);

      setUserSubsDegenfans(allChannelsDegenFans);
    };

    if (fid > 0) {
      fetchAllData();
    }
  }, [fid]);

  useEffect(() => {
    const updatedSubs = userSubsAlfafrens.map((alfaFren) => {
      const matchedDegenFan = userSubsDegenFans.find(
        (degenFan) => degenFan.channelId === alfaFren.channelId
      );

      if (matchedDegenFan) {
        return {
          ...alfaFren,
          userChannelAlfa: matchedDegenFan.userChannelAlfa,
          lastUpdated: matchedDegenFan.lastUpdated,
        };
      } else {
        return {
          ...alfaFren,
          userChannelAlfa: 999999,
          lastUpdated: 31313131,
        };
      }
    });
    setUpdatedUserSubsAlfafrens(updatedSubs);
  }, [userSubsAlfafrens, userSubsDegenFans]);

  useEffect(() => {
    const total = updatedUserSubsAlfafrens
      .filter(
        (sub) => sub.userChannelAlfa !== 999999 && !isNaN(sub.userChannelAlfa)
      )
      .reduce((sum, sub) => sum + parseFloat(sub.userChannelAlfa), 0);

    setTotalAlfaAllocationPerMo(total);
  }, [updatedUserSubsAlfafrens]);

  useEffect(() => {
    const getUserStakedListFetchData = async (userAddress) => {
      try {
        const stakedListResponse = await getUserStakedList(userAddress);
        const updatedList = await Promise.all(
          stakedListResponse.account.poolMemberships.map(
            async (poolMembership) => {
              const poolAdminId = poolMembership.pool.admin.id;
              const channelData = await fetchChannelData(poolAdminId);
              const updatedPoolMembership = { ...poolMembership, channelData };
              return updatedPoolMembership;
            }
          )
        );
        setUpdatedUserStakedList(updatedList);
        const calculateEarnings = (item) => {
          if (
            item.channelData.owner.toLowerCase() === userAddress.toLowerCase()
          ) {
            return (
              (((((item.channelData.estimatedEarningsPerSecond *
                60 *
                60 *
                24 *
                30) /
                10000000000) *
                (item.pool.poolMembers[0].units * 94)) /
                100 /
                1000000) *
                100) /
              100
            );
          } else {
            return (
              (((((item.channelData.estimatedEarningsPerSecond *
                60 *
                60 *
                24 *
                30) /
                10000000000) *
                (item.pool.poolMembers[0].units * 100)) /
                70 /
                1000000) *
                100) /
              100
            );
          }
        };

        let total = 0;
        updatedList.forEach((item) => {
          const earnings = calculateEarnings(item);
          total += earnings;
        });

        setTotalEarnings(total);
        setUpdatedUserStakedList(updatedList);
      } catch (error) {
        console.error("Error fetching user staked list:", error);
      }
    };

    if (userMinData && userMinData.userAddress) {
      getUserStakedListFetchData(userMinData.userAddress);
    }
  }, [userMinData]);

  const calculateChannelCost = (response) => {
    if (!response) return "N/A";
    const cost =
      response.totalSubscriptionFlowRate /
      380517503805.174 /
      response.numberOfSubscribers;
    return cost.toFixed(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChannelData(userMinData.channeladdress);
        const channelCost = calculateChannelCost(response);
        setTotalSubEarnings(
          response?.numberOfSubscribers * ((channelCost * 25) / 100)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (userMinData && userMinData.channeladdress) {
      fetchData();
    }
  }, [userMinData]);

  function converDate(timestamp) {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const isoDateString = date.toISOString(); // Convert date to ISO 8601 format
    return isoDateString;
  }
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MonthlyEarnings
                  userBalanceFuncHistory={userBalanceFuncHistory}
                  balanceArea={
                    userBalanceFunc && userBalanceFunc.balance > 0 ? (
                      <FlowingBalance
                        startingBalance={BigInt(userBalanceFunc.balance)}
                        startingBalanceDate={
                          new Date(converDate(userBalanceFunc.timestamp))
                        }
                        flowRate={BigInt(
                          Math.round(
                            (
                              (totalEarnings +
                                totalSubEarnings -
                                userBalanceFunc?.totalOutflowRate /
                                  380517503050) *
                              380517503050
                            ).toFixed(0)
                          )
                        )}
                      />
                    ) : (
                      <>0000.00000</>
                    )
                  }
                  degenPrice={degenPrice}
                />
              </Grid>
              <Grid item xs={12}>
                <YearlyBreakup
                  totalEarnings={totalEarnings}
                  totalSubEarnings={totalSubEarnings}
                  userBalanceFunc={userBalanceFunc}
                  totalOutflowRate={userBalanceFunc?.totalOutflowRate}
                  totalAlfaAllocationPerMo={totalAlfaAllocationPerMo}
                  degenPrice={degenPrice}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={8}>
            {updatedUserSubsAlfafrens.length > 0 ? (
              <ProductPerformance
                userSubs={updatedUserSubsAlfafrens}
                limit={5}
                degenPrice={degenPrice}
              />
            ) : (
              <>Loading Your Sub List</>
            )}
          </Grid>
          <Grid item xs={12} lg={8}>
            <StakePerformance
              userSubs={updatedUserStakedList}
              userMinData={userMinData}
              limit={5}
            />
          </Grid>
          {userRecentTransactions.length > 0 ? (
            <Grid item xs={12} lg={4}>
              <RecentTransactions
                userRecentTransactions={userRecentTransactions}
                limit={7}
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
