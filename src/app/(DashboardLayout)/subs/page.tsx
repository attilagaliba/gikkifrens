"use client";
import { Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import ProductPerformance from "../components/dashboard/ProductPerformance";

const SamplePage = () => {
  const userSubs = [
    {
      userDisplayName: "Chef 🎩",
      userPfp: "https://i.imgur.com/zpASdSb.png",
      userChannelAlfa: 256.23,
      userChannelCost: 1000,
    },
    {
      userDisplayName: "mingbada🎩",
      userPfp:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/c1d1b67a-b386-4452-51ef-c57c7c510700/rectcrop3",
      userChannelAlfa: 165,
      userChannelCost: 500,
    },
    {
      userDisplayName: "🃏agusti 🔷🐘",
      userPfp: "https://i.imgur.com/HRs0nGc.jpeg",
      userChannelAlfa: 430,
      userChannelCost: 1500,
    },
    {
      userDisplayName: "hoshino🎩⚪️🔵🟡🃏",
      userPfp:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/b8994e49-6170-4d0a-de86-843e7327fb00/original",
      userChannelAlfa: 138.65,
      userChannelCost: 500,
    },
    {
      userDisplayName: "ggang",
      userPfp:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/463b50d3-600b-4802-d8f1-336c4838b300/rectcrop3",
      userChannelAlfa: 201,
      userChannelCost: 500,
    },
    {
      userDisplayName: "Hitendra 🇮🇳🎩🔵☔",
      userPfp: "https://i.imgur.com/c7kXEdT.jpeg",
      userChannelAlfa: 150.6,
      userChannelCost: 500,
    },
  ];

  return (
    <PageContainer title="YOUR STAKES" description="this is Sample page">
      <ProductPerformance userSubs={userSubs} limit={5000} />
    </PageContainer>
  );
};

export default SamplePage;
