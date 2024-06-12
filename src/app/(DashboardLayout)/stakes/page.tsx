/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import StakePerformance from "../components/dashboard/StakePerformance";
import LinearProgress from "@mui/material/LinearProgress";
import {
  getUserStakedList,
  fetchChannelData,
  getUserStake,
  getUserByFid,
} from "../func/galiba";
import { useProfile } from "@farcaster/auth-kit";

const SamplePage = () => {
  const [updatedUserStakedList, setUpdatedUserStakedList] = useState<any>([]);
  const [userMinData, setUserMinData] = useState<any>([]);
  const [fid, setFid] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [custody, setCustody] = useState<string | null>(null);
  const [userSelfStake, setUserSelfStake] = useState<any>(0);

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
          console.log("user: ", userMinData);
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
    const getUserStakedListFetchData = async (userAddress: string) => {
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
              const updatedPoolMembership = { ...poolMembership, channelData };
              return updatedPoolMembership;
            }
          )
        );
        setUpdatedUserStakedList(updatedList);
      } catch (error) {
        console.error("Error fetching user staked list:", error);
      }
    };

    if (userMinData && userMinData.userAddress) {
      getUserStakedListFetchData(userMinData.userAddress);
    }
  }, [userMinData]);
  return (
    <PageContainer title="YOUR STAKES" description="this is Sample page">
      {userSelfStake > 0 ? (
        <StakePerformance
          userSubs={updatedUserStakedList}
          userMinData={userMinData}
          userSelfStake={userSelfStake}
        />
      ) : (
        <>
          <LinearProgress />
          Loading Your Stake List
          <LinearProgress />
        </>
      )}
    </PageContainer>
  );
};

export default SamplePage;
