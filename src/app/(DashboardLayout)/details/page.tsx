/* eslint-disable react-hooks/exhaustive-deps */
// app/page.tsx

"use client";
import { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";

import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
import Profit from "@/app/(DashboardLayout)/components/dashboard/Profit";
import FlowingDegen from "@/app/(DashboardLayout)/components/FlowingDegen";
import FlowingBalance from "@/app/(DashboardLayout)/components/FlowingBalance";
import DetailedBalance from "@/app/(DashboardLayout)/components/dashboard/DetailedBalance";
import StakeChart from "@/app/(DashboardLayout)/components/details/stakeChart";
import LinearProgress from "@mui/material/LinearProgress";
import DetailsTotals from "@/app/(DashboardLayout)/components/dashboard/DetailsTotals";
import RecentTransactionsTotal from "@/app/(DashboardLayout)/components/dashboard/RecentTransactionsTotal";

import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

interface State extends SnackbarOrigin {
  open: boolean;
}

import {
  getUserTrasfers,
  getUserByFid,
  getUserStakedList,
  getUserAlfaBalance,
  getUserStake,
  getUserBalance,
  getUserBalanceHistory,
  getSubsRew,
  fetchChannelData,
  getUserSubscribedChannels,
} from "../func/galiba";

import React from "react";

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

  const [degenPrice, setDegenPrice] = useState<number>(0.02);
  const [userSelfStake, setUserSelfStake] = useState<any>(0);
  const [userRecentTransactions, setUserRecentTransactions] = useState<any[]>(
    []
  );

  const [userAlfaBalance, setUserAlfaBalance] = useState(0);

  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSubEarnings, setTotalSubEarnings] = useState(0);

  const [fid, setFid] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [custody, setCustody] = useState<string | null>(null);
  const [channelData, setChannelData] = useState<any>(null);
  const [userData, setUserData] = useState<any>({
    userFid: null,
    userDisplayName: null,
    userBalance: null,
    userSubscriptions: 0,
    userDailyAlfa: 0,
    userStakeCashback: 0,
    userChannelEarnings: 0,
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const getUserStakeFunc = async (
    userAddress: any,
    userChannel: any,
    toConvertNumber: number
  ) => {
    try {
      if (
        !userSelfStake &&
        userAddress !== undefined &&
        userChannel !== undefined
      ) {
        const responseBalance = await getUserStake(userAddress, userChannel);
        if (responseBalance) {
          return Number(
            (responseBalance.result.balance / 100000000000000) * toConvertNumber
          ).toFixed(2);
        }
      } else {
        return 0;
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (userMinData) {
      const fetchData = async () => {
        try {
          const userSelfStakeFunc = await getUserStakeFunc(
            userMinData.userAddress,
            userMinData.channeladdress,
            1
          );
          setUserSelfStake(userSelfStakeFunc);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [userMinData]);

  useEffect(() => {
    if (userMinData) {
      const fetchData = async () => {
        try {
          const userAlfa = await getUserAlfaBalance(userMinData.userAddress);
          setUserAlfaBalance(userAlfa.result.alfaBalance);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [userMinData]);

  ///////////////

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChannelData(userMinData.channeladdress);
        setChannelData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (userMinData && userMinData.channeladdress) {
      fetchData();
    }
  }, [userMinData]);

  const calculateStakeForOneAlfa = () => {
    if (!channelData) return "N/A";
    const stake =
      (channelData.estimatedEarningsPerSecond * 60 * 60 * 24 * 30) /
      10000000000;
    return stake.toFixed(2);
  };

  const calculateChannelCostChannelData = () => {
    if (!channelData) return "N/A";
    const cost =
      channelData.totalSubscriptionFlowRate /
      380517503805.174 /
      channelData.numberOfSubscribers;
    return cost.toFixed(0);
  };
  ////////////
  useEffect(() => {
    if (fid && userMinData && userMinData.userAddress) {
      const fetchData = async () => {
        try {
          setUserData({
            userFid: fid,
            userDisplayName: displayName,
            userBalance: userBalanceFunc
              ? (userBalanceFunc.balance / 1000000000000000000).toFixed(4)
              : null,
            userSubscriptions: updatedUserSubsAlfafrens.length,
            userTotalSubsCost: totalSubEarnings,
            userDailyAlfa: (totalAlfaAllocationPerMo / 30).toFixed(2),
            userStakeCashback: (totalEarnings - totalSubEarnings).toFixed(2),
            userChannelEarnings: totalSubEarnings,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [
    fid,
    displayName,
    custody,
    userMinData,
    userBalanceFunc,
    totalAlfaAllocationPerMo,
    totalSubEarnings,
    updatedUserSubsAlfafrens,
    totalEarnings,
    updatedUserStakedList,
    userSubsAlfafrens,
  ]);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  const [state, setState] = React.useState<State>({
    open: true,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

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
    if (fid && fid > 0) {
      fetchData();
    }
  }, [fid]);

  useEffect(() => {
    const fetchAllData = async () => {
      const allChannelsDegenFans = await getSubsRew(fid);
      setUserSubsDegenfans(allChannelsDegenFans);
    };

    if (fid && fid > 0) {
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
    const getUserStakedListFetchData = async (userAddress: string) => {
      if (userAddress && userSelfStake > 0 && userMinData) {
        try {
          const stakedListResponse = await getUserStakedList(userAddress);
          const updatedList = await Promise.all(
            stakedListResponse.account.poolMemberships.map(
              async (poolMembership: { pool: { admin: { id: any } } }) => {
                const poolAdminId = poolMembership.pool.admin.id;
                let channelData;
                try {
                  channelData = await fetchChannelData(poolAdminId);
                } catch (error) {
                  console.error("Error fetching channel data:", error);
                  channelData = {
                    id: `${userAddress}`,
                    lastUpdatedTimestamp: "unknown",
                    numberOfSubscribers: 0,
                    numberOfStakers: 0,
                    totalSubscriptionFlowRate: "1",
                    totalSubscriptionInflowAmount: "1",
                    totalClaimed: "1",
                    owner: `${userAddress}`,
                    currentStaked: "1",
                    estimatedEarningsPerSecond: "1",
                    incomeToStakeRatio: "1",
                    stakeToIncomeRatio: "1",
                    totalSubscriptionCashbackFlowRate: "1",
                    totalSubscriptionCashbackFlowAmount: "1",
                    title: "unknown",
                    bio: "unknown",
                  };
                }
                const updatedPoolMembership = {
                  ...poolMembership,
                  channelData,
                };
                return updatedPoolMembership;
              }
            )
          );
          setUpdatedUserStakedList(updatedList);
          const calculateEarnings = (item: {
            channelData: { owner: string; estimatedEarningsPerSecond: number };
            pool: { poolMembers: { units: number }[] };
          }) => {
            if (
              item.channelData.owner.toLowerCase() === userAddress.toLowerCase()
            ) {
              const result: number =
                ((item.channelData.estimatedEarningsPerSecond *
                  60 *
                  60 *
                  24 *
                  30) /
                  10000000000) *
                userSelfStake;
              const resultPlusOnePercent: number = result * 1.01;

              return resultPlusOnePercent;
            } else {
              return (
                (((((item.channelData.estimatedEarningsPerSecond *
                  60 *
                  60 *
                  24 *
                  30) /
                  10000000000) *
                  (item.pool.poolMembers[0].units * 100)) /
                  69.069 /
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
      }
    };

    if (userMinData && userMinData.userAddress) {
      getUserStakedListFetchData(userMinData.userAddress);
    }
  }, [userMinData, userSelfStake]);

  const calculateChannelCost = (response: {
    totalSubscriptionFlowRate: any;
    numberOfSubscribers: any;
  }) => {
    if (!response) return "N/A";
    const cost =
      response.totalSubscriptionFlowRate /
      380517503805.174 /
      response.numberOfSubscribers;
    return cost.toFixed(0);
  };

  const handleOpen = (newState: SnackbarOrigin) => () => {
    setState({ ...newState, open: true });
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      handleOpen({ vertical, horizontal });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChannelData(userMinData.channeladdress);
        const channelCost = calculateChannelCost(response);
        setTotalSubEarnings(
          response?.numberOfSubscribers * ((Number(channelCost) * 25) / 100)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (userMinData && userMinData.channeladdress) {
      fetchData();
    }
  }, [userMinData]);

  function converDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const isoDateString = date.toISOString();
    return isoDateString;
  }
  
  return (
    <PageContainer title="Details GikkiFrens" description="this is Dashboard">
      <Box>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClick={handleClose}
          message={`Go to my Alfafrens chat for bugs and feedback || Much love <3 :3`}
          key={vertical + horizontal}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Profit
                  totalEarnings={totalEarnings}
                  totalSubEarnings={totalSubEarnings}
                  userBalanceFunc={userBalanceFunc}
                  totalOutflowRate={userBalanceFunc?.totalOutflowRate}
                  totalAlfaAllocationPerMo={totalAlfaAllocationPerMo}
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
            <DetailedBalance
              userAlfaBalance={userAlfaBalance}
              userBalanceFuncHistory={userBalanceFuncHistory}
              balanceArea={
                userBalanceFunc && userBalanceFunc.balance > 0 ? (
                  <>
                    <FlowingBalance
                      startingBalance={BigInt(userBalanceFunc.balance)}
                      startingBalanceDate={
                        new Date(converDate(userBalanceFunc.timestamp))
                      }
                      flowRate={BigInt(
                        Number(
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
                    $
                    <FlowingDegen
                      degenPrice={degenPrice}
                      startingBalance={BigInt(userBalanceFunc.balance)}
                      startingBalanceDate={
                        new Date(converDate(userBalanceFunc.timestamp))
                      }
                      flowRate={BigInt(
                        Number(
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
                  </>
                ) : (
                  <>0000.00000</>
                )
              }
              degenPrice={degenPrice}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            {updatedUserSubsAlfafrens.length > 0 && userSelfStake > 0 ? (
              <StakeChart
                userSubs={updatedUserStakedList}
                userMinData={userMinData}
                userSelfStake={userSelfStake}
              />
            ) : (
              <>
                <LinearProgress />
                Loading Your Stake Chart
                <LinearProgress />
              </>
            )}
          </Grid>

          <Grid item xs={4} lg={3}>
            <DetailsTotals channelData={channelData} />
          </Grid>

          {userRecentTransactions.length > 0 ? (
            <Grid item xs={12} lg={3}>
              <RecentTransactionsTotal
                userRecentTransactions={userRecentTransactions}
                limit={7}
              />
            </Grid>
          ) : (
            <Grid item xs={12} lg={4}>
              <LinearProgress />
              Loading Your Datas
              <LinearProgress />
            </Grid>
          )}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
