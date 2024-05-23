"use client";
import { Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import StakePerformance from "../components/dashboard/StakePerformance";


const SamplePage = () => {

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
    <PageContainer title="YOUR SUBSCRIPTIONS" description="this is Sample page">
      <StakePerformance userSubs={userStakes} limit={5000} />
    </PageContainer>
  );
};

export default SamplePage;
