"use client";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
} from "@mui/material";
const SamplePage = () => {
  const [generatedContent, setGeneratedContent] =
    useState<string>("Waiting af...");

  const [degenPrice, setDegenPrice] = useState(0.01);
  const [isGenerating, setIsGenerating] = useState<boolean>(false); // Yeni state ekledik

  const apiKey = "AIzaSyAmeJjqu5K5ty7ZyEr2JDg9v30PCna01Us";
  const requestUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const systemDescription = `
System:
- You can subscribe monthly by paying "Degen" as a user, and in return, you earn "Alfa" monthly.
- You can claim the Alfars you earned whenever you want to your account.
- By staking "Alfa", you earn "degen" monthly.

Calculations are done instantly. For example, the amounts you earn or pay monthly are deducted from your account every second. If you subscribe to 500 Degen, 500 degen is deducted from your account every second and reaches 0 at the end of the month. So, if you unsubscribe, you only pay for the time you subscribed, or even if you have only 100 degen in your account, you can subscribe to a channel or channels that cost 500 degen.

Additionally, we can collect subscribers by opening our own channel, and we receive monthly payments per subscriber to our own channel.
`;

  const userData = {
    userFid: 474817,
    userDisplayName: `attilagaliba`,
    userPfp: `https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/df368ec8-99d7-4485-b261-9cd4efd8f200/original`,
    userBalance: 1840.124,
    userAlfaBalance: 0,
    userAlfaClaimable: 28.602736,
    userSubs: 327,
    userSubsCost: 18000,
    userDailyAlfa: 218.23,
    userStakes: 8,
    userStakedAlfa: 2699.23,
    userStakeCashback: 18374,
    userChannelSubs: 51,
    userChannelEarnings: 6375,
  };

  const aiData = {
    dataUnits: {
      userBalance: "DEGEN",
      userAlfaBalance: "ALFA",
      userAlfaClaimable: "ALFA",
      userSubsCost: "DEGEN",
      userDailyAlfa: "ALFA",
      userStakes: "ALFA",
      userStakedAlfa: "ALFA",
      userStakeCashback: "DEGEN",
      userChannelEarnings: "DEGEN",
    },
    dataDescription: {
      userBalance: "User Current Degen Balance",
      userAlfaBalance: "User Current Claimed Alfa Balance",
      userAlfaClaimable: "User Current Claimable Alfa Balance",
      userSubs: "User Subscription Count",
      userSubsCost: "User's Subscription Cost Paid Monthly",
      userDailyAlfa: "User's Daily Alfa Reward",
      userStakes: "User's Stake Count",
      userStakedAlfa: "User's Staked Alfa",
      userStakeCashback: "User's Income Degen from Stakes",
      userChannelSubs: "User's Channel Subscription Count",
      userChannelEarnings:
        "User's Income Degen from User's Channel Subscriptions",
    },
  };

  const generateContent = async () => {
    setIsGenerating(true);
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `* Response should return with html codes. * ${systemDescription} * Response should return with html codes. * Can you analyse that data? I want recommendations for the user's daily earnings and earning more. Also advice on how many subscribers you should have to double your earnings, how much alpha stake you should make, and what you should do without reducing your expenses. * Response should return with html codes. I want to speak in urban language. Sometimes you can make fun of it. Data: ${JSON.stringify(
                userData
              )} *  Data's Descriptions: ${JSON.stringify(aiData)}`,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const storyText = data.candidates[0].content.parts[0].text;
      const cleanHtml = storyText.replace(/^```html\n|```$/g, "");
      setGeneratedContent(cleanHtml);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageContainer title="YOUR SUBSCRIPTIONS" description="this is Sample page">
      <DashboardCard>
        {/* Butonun durumu göre render edilmesi */}
        {isGenerating ? (
          <Button
            variant="contained"
            disableElevation
            color="secondary"
            disabled
          >
            Asking...
          </Button>
        ) : (
          <Button
            variant="contained"
            disableElevation
            color="primary"
            onClick={generateContent}
          >
            Generate Analyse
          </Button>
        )}
        <div>
          <h2>Ai Fren:</h2>
          <DashboardCard>
            <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
          </DashboardCard>
        </div>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;
