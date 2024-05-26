"use client";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import ProductPerformance from "../components/dashboard/ProductPerformance";
import axios from "axios";
import { useProfile } from "@farcaster/auth-kit";
import { getSubsRew } from "../func/galiba";

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
      const allChannels = await getSubsRew(fid);
      setUserSubs(allChannels);
    };

    if (fid > 0) {
      fetchAllData();
    }
  }, [fid]);


  return (
    <PageContainer title="YOUR SUBSCRIPTIONS" description="this is Sample page">
      <ProductPerformance userSubs={userSubs} limit={5000} />
    </PageContainer>
  );
};

export default SamplePage;
