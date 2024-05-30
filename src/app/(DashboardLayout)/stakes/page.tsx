"use client";
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import StakePerformance from "../components/dashboard/StakePerformance";
import {
  getUserStakedList,
  fetchChannelData,
  getUserByFid,
} from "../func/galiba";
import { useProfile } from "@farcaster/auth-kit";

const SamplePage = () => {
  const [updatedUserStakedList, setUpdatedUserStakedList] = useState<any>([]);
  const [userMinData, setUserMinData] = useState<any>([]);
  const [fid, setFid] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [custody, setCustody] = useState<string | null>(null);

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
    const getUserStakedListFetchData = async (userAddress: string) => {
      try {
        const stakedListResponse = await getUserStakedList(userAddress);
        const updatedList = await Promise.all(
          stakedListResponse.account.poolMemberships.map(
            async (poolMembership: { pool: { admin: { id: any; }; }; }) => {
              const poolAdminId = poolMembership.pool.admin.id;
              const channelData = await fetchChannelData(poolAdminId);
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
      <StakePerformance
        userSubs={updatedUserStakedList}
        userMinData={userMinData}
      />
    </PageContainer>
  );
};

export default SamplePage;
