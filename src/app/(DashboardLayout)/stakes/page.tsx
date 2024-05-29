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
  const [updatedUserStakedList, setUpdatedUserStakedList] = useState([]);
  const [userMinData, setUserMinData] = useState<any>([]);

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
        limit={5000}
      />
    </PageContainer>
  );
};

export default SamplePage;
