"use client";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import ProductPerformance from "../components/dashboard/ProductPerformance";
import axios from "axios";
import { useProfile } from "@farcaster/auth-kit";

const SamplePage = () => {
  const [userMinData, setUserMinData] = useState([]);
  const [userGetSubs, setUserGetSubs] = useState([]);
  const [userSubs, setUserSubs] = useState([]);

  const profile = useProfile();
  const {
    isAuthenticated,
    profile: { fid, displayName, custody },
  } = profile;
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
      console.log(allChannels);
      setUserSubs(allChannels);
    };

    if (fid > 0) {
      fetchAllData();
    }
  }, [fid]);
  const lastUpdateMessage = `${Math.floor(
    (Date.now() -
      new Date(userSubs[0]?.lastUpdated ?? "2024-05-19T08:11:45Z").getTime()) /
      60000
  )} min ago`;

  return (
    <PageContainer title="YOUR SUBSCRIPTIONS" description="this is Sample page">
      Last Update: {lastUpdateMessage}
      <ProductPerformance userSubs={userSubs} limit={5000} />
    </PageContainer>
  );
};

export default SamplePage;
