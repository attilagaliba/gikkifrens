/* eslint-disable react-hooks/exhaustive-deps */
// app/page.tsx

"use client";
import { useEffect, useState, useCallback } from "react";
import { Grid, Box, CircularProgress, LinearProgress, Snackbar, SnackbarOrigin } from "@mui/material";
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
  getUserStake,
  getUserBalance,
  getUserBalanceHistory,
  getSubsRew,
  fetchChannelData,
  getUserSubscribedChannels,
} from "../func/galiba";

import React from "react";

const useSnackbar = () => {
  const [state, setState] = useState<SnackbarOrigin>({
    open: true,
    vertical: "top",
    horizontal: "center",
  });

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleOpen = useCallback((newState: SnackbarOrigin) => {
    setState({ ...newState, open: true });
  }, []);

  return {
    state,
    handleClose,
    handleOpen,
  };
};

const useUserData = () => {
  const [userData, setUserData] = useState<any>({
    userFid: null,
    userDisplayName: null,
    userBalance: null,
    userSubscriptions: 0,
    userDailyAlfa: 0,
    userStakeCashback: 0,
    userChannelEarnings: 0,
  });

  const updateUserData = (data: any) => {
    setUserData((prevData: any) => ({ ...prevData, ...data }));
  };

  return {
    userData,
    updateUserData,
  };
};

const Dashboard = () => {
  const [userMinData, setUserMinData] = useState<any>({});
  const [userBalanceFunc, setUserBalanceFunc] = useState<any>(null);
  const [userBalanceFuncHistory, setUserBalanceHistoryFunc] = useState<any>(null);

  const [userSelfStake, setUserSelfStake] = useState<any>(0);
  const [updatedUserStakedList, setUpdatedUserStakedList] = useState<any[]>([]);
  const [updatedUserSubsAlfafrens, setUpdatedUserSubsAlfafrens] = useState<any[]>([]);

  const [degenPrice, setDegenPrice] = useState<number | undefined>(0.016);
  const [userRecentTransactions, setUserRecentTransactions] = useState<any[]>([]);

  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSubEarnings, setTotalSubEarnings] = useState(0);
  const [totalAlfaAllocationPerMo, setTotalAlfaAllocationPerMo] = useState(0);

  const { state, handleClose, handleOpen } = useSnackbar();
  const { userData, updateUserData } = useUserData();

  const [fid, setFid] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [custody, setCustody] = useState<string | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const getUserStakeFunc = useCallback(async (userAddress: any, userChannel: any, toConvertNumber: number) => {
    try {
      if (!userSelfStake && userAddress && userChannel) {
        const responseBalance = await getUserStake(userAddress, userChannel);
        if (responseBalance) {
          return Number((responseBalance.result.balance / 100000000000000) * toConvertNumber).toFixed(2);
        }
      }
      return 0;
    } catch (error) {
      console.error("Error fetching user stake:", error);
      return 0;
    }
  }, [userSelfStake]);

  useEffect(() => {
    if (userMinData.userAddress) {
      const fetchUserStake = async () => {
        const userSelfStakeFunc = await getUserStakeFunc(userMinData.userAddress, userMinData.channeladdress, 1);
        setUserSelfStake(userSelfStakeFunc);
      };
      fetchUserStake();
    }
  }, [userMinData, getUserStakeFunc]);

  useEffect(() => {
    if (fid && userMinData.userAddress) {
      const fetchUserData = async () => {
        updateUserData({
          userFid: fid,
          userDisplayName: displayName,
          userBalance: userBalanceFunc ? (userBalanceFunc.balance / 1000000000000000000).toFixed(4) : null,
          userSubscriptions: updatedUserSubsAlfafrens.length,
          userTotalSubsCost: totalSubEarnings,
          userDailyAlfa: (totalAlfaAllocationPerMo / 30).toFixed(2),
          userStakeCashback: (totalEarnings - totalSubEarnings).toFixed(2),
          userChannelEarnings: totalSubEarnings,
        });
      };
      fetchUserData();
    }
  }, [
    fid,
    displayName,
    userMinData,
    userBalanceFunc,
    totalAlfaAllocationPerMo,
    totalSubEarnings,
    updatedUserSubsAlfafrens,
    totalEarnings,
    updateUserData,
  ]);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    const fetchDegenPrice = async () => {
      try {
        const response = await fetch("https://li.quest/v1/token?chain=8453&token=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed");
        const result = await response.json();
        setDegenPrice(parseFloat(parseFloat(result.priceUSD).toFixed(4)));
      } catch (error) {
        console.error("Error fetching Degen price:", error);
      }
    };
    fetchDegenPrice();
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
    if (fid && fid > 0) {
      const fetchUserDataByFid = async () => {
        const userData = await getUserByFid(fid);
        setUserMinData(userData);
      };
      fetchUserDataByFid(fid);
    }
  }, [fid]);

  useEffect(() => {
    if (userMinData.userAddress) {
      const fetchBalanceData = async () => {
        const userBalance = await getUserBalance(userMinData.userAddress);
        const userBalanceHistory = await getUserBalanceHistory(userMinData.userAddress);
        setUserBalanceFunc(userBalance);
        setUserBalanceHistoryFunc(userBalanceHistory);
      };
      fetchBalanceData();
    }
  }, [userMinData]);

  useEffect(() => {
    if (userMinData.userAddress) {
      const fetchTransfersData = async () => {
        const userTransfers = await getUserTrasfers(userMinData.userAddress);
        const accountData = userTransfers.data.account;
        const mergedTransfers = [
          ...accountData.receivedTransferEvents.map(
            (event: { value: string; timestamp: any }) => ({
              action: "deposit",
              value: parseFloat(event.value) / 10 ** 18, // Convert value to ETH
              date: event.timestamp || null, // If no timestamp, set null
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
                action: event.to.id === "0xf3aaefee7ec04fe3757733290b318f1748bb0852" ? "gas" : "withdraw",
                value: parseFloat(event.value) / 10 ** 18, // Convert value to ETH
                date: event.timestamp || null, // If no timestamp, set null
              })
            ),
        ];
        setUserRecentTransactions(mergedTransfers);
      };
      fetchTransfersData();
    }
  }, [userMinData]);

  useEffect(() => {
    if (userMinData.userAddress) {
      const fetchChannelDataAndSubscriptions = async () => {
        const channelData = await fetchChannelData(userMinData.userAddress);
        const userSubs = await getUserSubscribedChannels(userMinData.userAddress);

        const userSubsList = await Promise.all(
          userSubs.result.subscriptions.map(async (subscription: any) => {
            const userSubsChannelData = await fetchChannelData(subscription.channel);
            const userSubsRew = await getSubsRew(subscription.channel);

            return {
              id: subscription.channel,
              balance: parseFloat(userSubsChannelData.result.balance) / 10 ** 18,
              dailyAlfa: parseFloat(userSubsChannelData.result.dailyAlfa) / 10 ** 18,
              staked: parseFloat(userSubsChannelData.result.staked) / 10 ** 18,
              name: userSubsRew.data.name,
              avatar: userSubsRew.data.avatar,
            };
          })
        );

        setUpdatedUserSubsAlfafrens(userSubsList);
        updateUserData({ userSubscriptions: userSubsList.length });
      };

      fetchChannelDataAndSubscriptions();
    }
  }, [userMinData, updateUserData]);

  useEffect(() => {
    if (userMinData.userAddress) {
      const fetchUserStakedList = async () => {
        const stakedList = await getUserStakedList(userMinData.userAddress);
        const stakedData = await Promise.all(
          stakedList.data.stakeHistory.map(async (stake: any) => {
            const userStakedRew = await getSubsRew(stake.channel);
            return {
              ...stake,
              name: userStakedRew.data.name,
              avatar: userStakedRew.data.avatar,
            };
          })
        );
        setUpdatedUserStakedList(stakedData);
      };

      fetchUserStakedList();
    }
  }, [userMinData]);

  useEffect(() => {
    const totalSubEarningsCalc = updatedUserSubsAlfafrens.reduce((acc: any, subs: any) => acc + subs.dailyAlfa, 0);
    setTotalSubEarnings(totalSubEarningsCalc);
  }, [updatedUserSubsAlfafrens]);

  useEffect(() => {
    if (userMinData.userAddress) {
      const fetchTotalEarnings = async () => {
        const total = updatedUserSubsAlfafrens.reduce((acc, subs) => acc + subs.balance, 0);
        setTotalEarnings(total);
      };

      fetchTotalEarnings();
    }
  }, [userMinData, updatedUserSubsAlfafrens]);

  useEffect(() => {
    const totalAlfaAllocation = updatedUserSubsAlfafrens.reduce((acc: any, subs: any) => acc + subs.dailyAlfa, 0);
    setTotalAlfaAllocationPerMo(totalAlfaAllocation * 30); // Assuming 30 days in a month
  }, [updatedUserSubsAlfafrens]);

  return (
    <PageContainer title="General">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SalesOverview
            userBalance={userData.userBalance}
            userDailyAlfa={userData.userDailyAlfa}
            userSubscriptions={userData.userSubscriptions}
            userChannelEarnings={userData.userChannelEarnings}
            userStakeCashback={userData.userStakeCashback}
            totalAlfaAllocationPerMo={totalAlfaAllocationPerMo}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <YearlyBreakup userStakeCashback={userData.userStakeCashback} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <MonthlyEarnings
            userChannelEarnings={userData.userChannelEarnings}
            userDailyAlfa={userData.userDailyAlfa}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <FlowingBalance userBalance={userData.userBalance} />
        </Grid>
        <Grid item xs={12}>
          <RecentTransactions transactions={userRecentTransactions} />
        </Grid>
        <Grid item xs={12} lg={8}>
          <ProductPerformance userSubs={updatedUserSubsAlfafrens} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <StakePerformance userStake={userSelfStake} userStakedList={updatedUserStakedList} />
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={state}
        open={state.open}
        onClose={handleClose}
        message="Data fetched successfully"
        key={state.vertical + state.horizontal}
      />
    </PageContainer>
  );
};

export default Dashboard;
