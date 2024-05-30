"use client";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { getUserAddress } from "../func/galiba";
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

  const [degenPrice, setDegenPrice] = useState(0.02);
  const [isGenerating, setIsGenerating] = useState<boolean>(false); // Yeni state ekledik
  const [bleuBalance, setBleuBalance] = useState(0);
  const [userWallet, setUserWallet] = useState("0x");

  const apiKey = "AIzaSyAmeJjqu5K5ty7ZyEr2JDg9v30PCna01Us";
  const requestUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const [fid, setFid] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [custody, setCustody] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>({
    userFid: null,
    userDisplayName: null,
    userBalance: null,
    userSubscriptions: 0,
    userDailyAlfa: 0,
    userStakeCashback: 0,
    userChannelEarnings: 0,
  });

  useEffect(() => {
    // localStorage'dan verilerin alınması
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://li.quest/v1/token?chain=8453&token=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
        );
        const result = await response.json();
        setDegenPrice(parseFloat(parseFloat(result.priceUSD).toFixed(4)));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
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
    const fetchData = async () => {
      try {
        const response = await getUserAddress(fid);
        if (response.Socials.Social[0].connectedAddresses[0].address) {
          setUserWallet(
            response.Socials.Social[0].connectedAddresses[0].address
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (fid && fid > 0) {
      fetchData();
    }
  }, [fid]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/getBleuBalance/${userWallet}`);
        const result = await response.json();
        const formattedBalance = (result.result / 1000000000000000000).toFixed(
          2
        );
        setBleuBalance(parseFloat(formattedBalance));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (userWallet && userWallet !== "0x") {
      fetchData();
    }
  }, [userWallet]);

  const creatingMessage = [
    "I'm on it, dude.",
    "Doing it right now.",
    "Got it covered, man.",
    "Working on it, bro.",
    "Just handling it, chill.",
    "Creating it, hold tight.",
    "Making it happen.",
    "I'm all over it.",
    "Sorting it out.",
    "Piecing it together.",
    "Putting it together, mate.",
    "Doing my thing.",
    "Hustling on it.",
    "Knocking it out.",
    "Cranking it out.",
    "Cooking it up.",
    "Whipping it up.",
    "Fixin' it up.",
    "Pulling it together.",
    "Knocking this out.",
    "On the job, don't worry.",
    "Smashing it out.",
    "Gonna make it.",
    "Crafting it now.",
    "Building it up.",
    "Doing my best, hold on.",
    "Jamming on it.",
    "Handling business.",
    "Putting in work.",
    "Getting it done.",
    "Tackling it now.",
    "Handling it, no sweat.",
    "Doing the thing.",
    "Making magic happen.",
    "Just getting started.",
    "Pushing through it.",
    "Rolling it out.",
    "Bringing it together.",
    "Putting in the effort.",
    "Giving it my all.",
    "Crafting it, don't stress.",
    "Piecing it, bit by bit.",
    "Forming it up.",
    "Making it, one sec.",
    "Kicking it off.",
    "Handling this, bro.",
    "Crushing it.",
    "Spinning it up.",
    "Setting it up.",
    "Working through it.",
  ];

  function getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * creatingMessage.length);
    return creatingMessage[randomIndex];
  }

  const systemDescription = `
System:
- You can subscribe monthly by paying "Degen" as a user, and in return, you earn "Alfa" monthly.
- You can claim the Alfars you earned whenever you want to your account.
- By staking "Alfa", you earn "degen" monthly.

Calculations are done instantly. For example, the amounts you earn or pay monthly are deducted from your account every second. If you subscribe to 500 Degen, 500 degen is deducted from your account every second and reaches 0 at the end of the month. So, if you unsubscribe, you only pay for the time you subscribed, or even if you have only 100 degen in your account, you can subscribe to a channel or channels that cost 500 degen.

Additionally, we can collect subscribers by opening our own channel, and we receive monthly payments per subscriber to our own channel.
`;

  const aiData = {
    dataUnits: {
      userBalance: "DEGEN",
      userDailyAlfa: "ALFA",
      userStakeCashback: "DEGEN",
      userChannelEarnings: "DEGEN",
    },
    dataDescription: {
      userBalance: "User Current Degen Balance",
      userSubscriptions: "User Subscription Count",
      userDailyAlfa: "User's Daily Alfa Reward",
      userStakeCashback: "User's Income Degen from Stakes",
      userChannelEarnings:
        "User's Income Degen from User's Channel Subscriptions",
    },
  };

  const generateContent = async () => {
    setGeneratedContent(getRandomMessage());
    setIsGenerating(true);
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `* Response should return with html codes and modern colored (purple palette) text. * ${systemDescription} * Response should return with html codes and modern colored (purple palette) text. * Can you analyse that data? I want recommendations for the user's daily earnings and earning more. Also advice on how many subscribers you should have to double your earnings, how much alpha stake you should make, and what you should do without reducing your expenses. * Response should return with html codes and modern colored (purple palette) text. I want to speak in urban language. Sometimes you can make fun of it. * Degen Price: 1 DEGEN = ${degenPrice} USD | ALFA has no financial equivalent. * and congratulate me for holding ${bleuBalance} $BLEU * Data: ${JSON.stringify(
                userData
              )} *  Data's Descriptions: ${JSON.stringify(aiData)}`,
            },
          ],
        },
      ],
    };

    const makeRequest = async (retryCount = 0) => {
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

        if (!storyText.startsWith("```html")) {
          throw new Error("Response did not start with ```html");
        }

        const cleanHtml = storyText.replace(/^```html\n|```$/g, "");
        setGeneratedContent(cleanHtml);
      } catch (error) {
        if (retryCount < 10) {
          setGeneratedContent(getRandomMessage());
          await makeRequest(retryCount + 1);
        } else {
          setGeneratedContent(
            "Failed to generate content after multiple attempts."
          );
        }
      }
    };

    try {
      await makeRequest();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageContainer title="Bleu AI" description="this is Sample page">
      <>
        <DashboardCard>
          <>
            <h3>Your Wallet: {userWallet} </h3>
            <h3>You have {bleuBalance} $BLEU</h3>
            {bleuBalance < 999999999999999999999999999999999999999999999999 ? (
              isGenerating ? (
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
              )
            ) : (
              <Button
                variant="contained"
                disableElevation
                color="secondary"
                disabled
              >
                You need hold more than 100 $BLEU for Bleu Ai
              </Button>
            )}
            <div>
              <h2>Ai Fren:</h2>
              <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
            </div>
          </>
        </DashboardCard>
      </>
    </PageContainer>
  );
};

export default SamplePage;
