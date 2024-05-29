"use client";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import ProductPerformance from "../components/dashboard/ProductPerformance";
import axios from "axios";
import { useProfile } from "@farcaster/auth-kit";
import { getSubsRew, getUserSubscribedChannels } from "../func/galiba";

const SamplePage = () => {
  const [userSubsAlfafrens, setUserSubsAlfafrens] = useState([]);
  const [userSubsDegenFans, setUserSubsDegenfans] = useState([]);
  const [updatedUserSubsAlfafrens, setUpdatedUserSubsAlfafrens] = useState([]);

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

  return (
    <PageContainer title="YOUR SUBSCRIPTIONS" description="this is Sample page">
      <ProductPerformance userSubs={updatedUserSubsAlfafrens} limit={5000} />
    </PageContainer>
  );
};

export default SamplePage;
