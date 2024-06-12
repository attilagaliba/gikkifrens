/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect, SetStateAction } from "react";
import { Typography } from "@mui/material";
import { getUserAddress } from "../func/galiba";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { Avatar, TextField, Grid } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { askAi } from "@/utils/openai";
import { Box, Button } from "@mui/material";
import {
  getUserTrasfers,
  getUserByFid,
  getUserStakedList,
  getUserAlfaBalance,
  getUserStake,
  getUserBalance,
  getUserBalanceHistory,
  getSubsRew,
  checkUser,
  fetchChannelData,
  getUserSubscribedChannels,
} from "../func/galiba";

const AiPage = () => {
  const [degenPrice, setDegenPrice] = useState(0.02);
  const [bleuPrice, setBleuPrice] = useState(0.001);
  const [isGenerating, setIsGenerating] = useState<boolean>(false); // Yeni state ekledik
  const [bleuBalance, setBleuBalance] = useState(0);
  const [userWallet, setUserWallet] = useState("0x");

  const [fid, setFid] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [custody, setCustody] = useState<string | null>(null);

  const [isSubMe, setIsSubMe] = useState(false);

  const [aiContent, setAiContent] = useState<string | null>(null);
  const [sendUserdata, setSendUserdata] = useState<any>({
    userDegenBalance: "0 Degen",
    userDailyAlfa: "0 Alfa",
    userStakeCashback: "0 Degen",
    userChannelSubs: 0,
    userChannelEarnings: "0 Degen",
    userBleuBalance: "0 Bleu",
    userSubscriptions: 0,
    userPaidForSubscriptions: "0 Degen",
  });

  //LanguageFunc
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const handleLanguageChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedLanguage(event.target.value);
  };

  // Get Prices
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Degen Price
        const degenResponse = await fetch(
          "https://li.quest/v1/token?chain=8453&token=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
        );
        const degenResult = await degenResponse.json();
        setDegenPrice(parseFloat(parseFloat(degenResult.priceUSD).toFixed(5)));

        // Fetch Bleu Price
        const bleuResponse = await fetch(
          "https://li.quest/v1/token?chain=8453&token=0xBf4Db8b7A679F89Ef38125d5F84dd1446AF2ea3B"
        );
        const bleuResult = await bleuResponse.json();
        setBleuPrice(parseFloat(parseFloat(bleuResult.priceUSD).toFixed(7)));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // GetUser
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
      const userData = await checkUser(fid);

      setIsSubMe(userData);
    };

    if (fid && fid > 0) {
      fetchData(fid);
    }
  }, [fid]);

  // Bleu Balance
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

  // Random Messages
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
  const randomEntry = [
    "Yo, elephants be one of da biggest land animals on dis planet, ya feel me? African elephants, dey got dem ears bigger than Asian elephants, ya know? Savanna elephants' ears be lookin' different from dem forest elephants, straight up. Dey some social animals, keepin' dem family ties tight. Usin' dey trunks, dey drink water, take baths, and grab food, all dat jazz. Pregnant elephants be carryin' fo' 'bout 22 months, damn! And dey got some insane memory skills, no lie.",
    "Yo, cats be one of da most popular pets out there, been chillin' wit humans fo' centuries. Dese cats, dey be night hunters, rockin' dope night vision and sharp hearin'. Dey be mad agile, flexin' dey flexibility and quick reflexes, ya dig? And check dis, cats communicate wit humans usin' body language and vocal tones, ain't dat cool? Dey be seen as independent and mysterious, but dey can be lovin' and loyal to they peeps too.",
    "Ayo, Earth be da third planet in our Solar System, holdin' it down as da only known planet supportin' life. Dis blue planet, 'bout 70% of it be covered in water, ya know? Earth's atmosphere be packin' oxygen and other gases vital fo' life. Earth be spinnin' 'round its axis, makin' day and night, while orbitin' 'round da Sun, causin' dem seasons, ya feel? Earth be diverse AF, wit all kinda climates and geographies, hostin' mad ecosystems and species. Our planet be filled wit natural resources crucial fo' survival, so we gotta keep it real and protect it, ya hear?",
    "water be da essence of life, ya know what I'm sayin'? It be da most essential substance for all living things, keepin' us hydrated and kickin'. 'Bout 70% of Earth be covered in water, givin' us oceans, lakes, and rivers to chill by. Water be involved in all kinds of processes in our bodies and da environment, makin' it a key player in keepin' things runnin' smooth.",
    "Aight, peep this, da first blockchain concept was introduced back in 1991 by two cats named Stuart Haber and W. Scott Stornetta. Dey came up wit dis idea to timestamp digital documents to make 'em tamper-proof. But da actual term 'blockchain' got poppin' in 2008 when Satoshi Nakamoto dropped da Bitcoin whitepaper, layin' da foundation for blockchain technology as we know it today.",
    "wine be dat classy drink dat's been around since ancient times, ya feel? It be made from fermented grapes and it's been enjoyed by peeps all over da world for centuries. Wine culture be deep, with different regions boastin' their own unique flavors and styles. From bold reds to crisp whites, wine be all about savorin' da moment and appreciatin' da craftsmanship behind each bottle.",
    "Check it, da world's first coffee cup dates back to da 15th century in da Ottoman Empire, homie. Dem early coffee cups, known as 'pialas,' was small, handleless cups made of porcelain or metal. Dey was perfect for sippin' on dat strong Turkish coffee, bringin' peeps together for deep convos and good vibes.",
    "da largest ashtray ever recorded was built in Argentina in 2011. Dis massive ashtray bein' 'bout 5.6 meters in diameter, weighin' 'bout 4,000 kilograms. It was built to promote awareness 'bout da harmful effects of smokin' and to encourage peeps to kick dat habit, ya know? It be a bold statement against smokin' and a reminder to take care of our health and environment.",
  ];
  function getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * creatingMessage.length);
    return creatingMessage[randomIndex];
  }
  function getRandomEntry() {
    const randomIndex = Math.floor(Math.random() * randomEntry.length);
    return randomEntry[randomIndex];
  }

  // Send AI Request
  async function generateContent() {
    if (!isGenerating) {
      try {
        setAiContent(getRandomMessage());
        setIsGenerating(true);
        const content = await askAi(
          sendUserdata,
          selectedLanguage,
          degenPrice,
          bleuPrice
        );
        const lines = content.message.content.split("\n\n");
        let fullContent = ""; // Tüm içeriği bir değişkene atamak için boş bir dize oluşturuyoruz
        for (const line of lines) {
          if (line.startsWith("**") && line.endsWith("**")) {
            // Eğer cümle kalın yazılması gerekiyorsa
            fullContent += `<strong>${line.substring(
              2,
              line.length - 2
            )}</strong><br/><br/>`;
          } else {
            fullContent += `${line}<br/><br/>`;
          }
        }
        setAiContent(fullContent);
      } catch (error) {
        console.error("Error occurred while fetching AI response:", error);
        setAiContent(null);
      } finally {
        setIsGenerating(false);
      }
    }
  }

  // Get User Stats
  const [userMinData, setUserMinData] = useState<any>([]);
  const [userBalanceFunc, setUserBalanceFunc] = useState<any>(null);
  const [userBalanceFuncHistory, setUserBalanceHistoryFunc] =
    useState<any>(null);
  const [updatedUserStakedList, setUpdatedUserStakedList] = useState<any[]>([]);

  const [userSubsAlfafrens, setUserSubsAlfafrens] = useState<any[]>([]);
  const [userSubsDegenFans, setUserSubsDegenfans] = useState<any[]>([]);
  const [updatedUserSubsAlfafrens, setUpdatedUserSubsAlfafrens] = useState<
    any[]
  >([]);

  const [totalAlfaAllocationPerMo, setTotalAlfaAllocationPerMo] = useState(0);
  const [userRecentTransactions, setUserRecentTransactions] = useState<any[]>(
    []
  );
  const [userSelfStake, setUserSelfStake] = useState<any>(0);
  const [channelData, setChannelData] = useState<any>(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSubEarnings, setTotalSubEarnings] = useState(0);

  const [userData, setUserData] = useState<any>({
    userFid: null,
    userDisplayName: null,
    userBalance: null,
    userSubscriptions: 0,
    userDailyAlfa: 0,
    userStakeCashback: 0,
    userChannelEarnings: 0,
  });

  //UserStats Func
  ///User Stake
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

  ///ChannelData
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChannelData(userMinData.channeladdress);
        setChannelData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (userMinData && userMinData.channeladdress) {
      fetchData();
    }
  }, [userMinData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChannelData(userMinData.channeladdress);
        const channelCost = calculateChannelCost(response);
        setTotalSubEarnings(
          response?.numberOfSubscribers * ((Number(channelCost) * 25) / 100)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (userMinData && userMinData.channeladdress) {
      fetchData();
    }
  }, [userMinData]);

  ///User Balance
  useEffect(() => {
    const fetchData = async () => {
      if (userMinData && userMinData.userAddress) {
        const userBalance = await getUserBalance(userMinData.userAddress);
        const userBalanceHistory = await getUserBalanceHistory(
          userMinData.userAddress
        );
        setUserBalanceFunc(userBalance);
        setUserBalanceHistoryFunc(userBalanceHistory);
      }
    };

    fetchData();
  }, [userMinData]);

  useEffect(() => {
    if (fid && userMinData && userMinData.userAddress) {
      const fetchData = async () => {
        try {
          setUserData({
            userFid: fid,
            userDisplayName: displayName,
            userBalance: userBalanceFunc
              ? (userBalanceFunc.balance / 1000000000000000000).toFixed(4)
              : null,
            userSubscriptions: updatedUserSubsAlfafrens.length,
            userTotalSubsCost: totalSubEarnings,
            userDailyAlfa: (totalAlfaAllocationPerMo / 30).toFixed(2),
            userStakeCashback: (totalEarnings - totalSubEarnings).toFixed(2),
            userChannelEarnings: totalSubEarnings,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [
    fid,
    displayName,
    custody,
    userMinData,
    userBalanceFunc,
    totalAlfaAllocationPerMo,
    totalSubEarnings,
    updatedUserSubsAlfafrens,
    totalEarnings,
    updatedUserStakedList,
    userSubsAlfafrens,
  ]);

  ///User Min Data
  useEffect(() => {
    const fetchData = async (fid: number) => {
      const userData = await getUserByFid(fid);

      setUserMinData(userData);
    };

    if (fid && fid > 0) {
      fetchData(fid);
    }
  }, [fid]);

  ///Transfers
  useEffect(() => {
    const fetchData = async () => {
      if (userMinData && userMinData.userAddress) {
        const userTransfers = await getUserTrasfers(userMinData.userAddress);
        const accountData = userTransfers.data.account;
        const mergedTransfers = [
          ...accountData.receivedTransferEvents.map(
            (event: { value: string; timestamp: any }) => ({
              action: "deposit",
              value: parseFloat(event.value) / 10 ** 18, // Ethereum'da değeri ETH'ye çevirmek için
              date: event.timestamp || null, // Eğer timestamp yoksa null
            })
          ),
          ...accountData.sentTransferEvents
            .filter(
              (event: { to: { id: string } }) =>
                event.to.id === "0xf3aaefee7ec04fe3757733290b318f1748bb0852" ||
                event.to.id === "0x0000000000000000000000000000000000000000"
            )
            .map(
              (event: {
                to: { id: string };
                value: string;
                timestamp: any;
              }) => ({
                action:
                  event.to.id === "0xf3aaefee7ec04fe3757733290b318f1748bb0852"
                    ? "gas"
                    : "withdraw",
                value: parseFloat(event.value) / 10 ** 18, // Ethereum'da değeri ETH'ye çevirmek için
                date: event.timestamp || null, // Eğer timestamp yoksa null
              })
            ),
        ];
        const sortedTransfers = mergedTransfers.sort(
          (a, b) => (b.date || 0) - (a.date || 0)
        );

        setUserRecentTransactions(sortedTransfers);
      }
    };

    fetchData();
  }, [userMinData]);

  //User SubsChannels
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allChannelsAlfaFrens = await getUserSubscribedChannels(fid);
        setUserSubsAlfafrens(allChannelsAlfaFrens);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (fid && fid > 0) {
      fetchData();
    }
  }, [fid]);
  useEffect(() => {
    const fetchAllData = async () => {
      const allChannelsDegenFans = await getSubsRew(fid);
      setUserSubsDegenfans(allChannelsDegenFans);
    };

    if (fid && fid > 0) {
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

  useEffect(() => {
    const total = updatedUserSubsAlfafrens
      .filter(
        (sub) => sub.userChannelAlfa !== 999999 && !isNaN(sub.userChannelAlfa)
      )
      .reduce((sum, sub) => sum + parseFloat(sub.userChannelAlfa), 0);

    setTotalAlfaAllocationPerMo(total);
  }, [updatedUserSubsAlfafrens]);

  ///User Staked List
  useEffect(() => {
    const getUserStakedListFetchData = async (userAddress: string) => {
      if (userAddress && userSelfStake > 0 && userMinData) {
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
                const updatedPoolMembership = {
                  ...poolMembership,
                  channelData,
                };
                return updatedPoolMembership;
              }
            )
          );
          setUpdatedUserStakedList(updatedList);
          const calculateEarnings = (item: {
            channelData: { owner: string; estimatedEarningsPerSecond: number };
            pool: { poolMembers: { units: number }[] };
          }) => {
            if (
              item.channelData.owner.toLowerCase() === userAddress.toLowerCase()
            ) {
              const result: number =
                ((item.channelData.estimatedEarningsPerSecond *
                  60 *
                  60 *
                  24 *
                  30) /
                  10000000000) *
                userSelfStake;
              const resultPlusOnePercent: number = result * 1.01;

              return resultPlusOnePercent;
            } else {
              return (
                (((((item.channelData.estimatedEarningsPerSecond *
                  60 *
                  60 *
                  24 *
                  30) /
                  10000000000) *
                  (item.pool.poolMembers[0].units * 100)) /
                  69.069 /
                  1000000) *
                  100) /
                100
              );
            }
          };

          let total = 0;
          updatedList.forEach((item) => {
            const earnings = calculateEarnings(item);
            total += earnings;
          });

          setTotalEarnings(total);
          setUpdatedUserStakedList(updatedList);
        } catch (error) {
          console.error("Error fetching user staked list:", error);
        }
      }
    };

    if (userMinData && userMinData.userAddress) {
      getUserStakedListFetchData(userMinData.userAddress);
    }
  }, [userMinData, userSelfStake]);

  ///Channel cost
  const calculateChannelCost = (response: {
    totalSubscriptionFlowRate: any;
    numberOfSubscribers: any;
  }) => {
    if (!response) return "N/A";
    const cost =
      response.totalSubscriptionFlowRate /
      380517503805.174 /
      response.numberOfSubscribers;
    return cost.toFixed(0);
  };

  ///Set User Stats For AI
  useEffect(() => {
    setSendUserdata({
      userDegenBalance:
        (userBalanceFunc?.balance / 1000000000000000000).toFixed(2) + " Degen",
      userDailyAlfa: (totalAlfaAllocationPerMo / 30).toFixed(2) + " Alfa",
      userStakeCashback: totalEarnings.toFixed(2) + " Degen",
      userChannelSubs: channelData?.numberOfSubscribers,
      userChannelEarnings: totalSubEarnings + " Degen",
      userBleuBalance: bleuBalance + " Bleu",
      userSubscriptions: updatedUserSubsAlfafrens?.length,
      userPaidForSubscriptions:
        (userBalanceFunc?.totalOutflowRate / 380517503050).toFixed(0) +
        " Degen",
    });
  }, [
    userBalanceFunc,
    totalAlfaAllocationPerMo,
    totalEarnings,
    bleuBalance,
    channelData,
    totalSubEarnings,
    updatedUserSubsAlfafrens,
  ]);

  return (
    <PageContainer title="Bleu AI" description="GikkiFrens Ai">
      <DashboardCard>
        <>
          <Grid container style={{ width: "100%", justifyContent: "center" }}>
            <Grid item xs={12} sm={8} md={10}>
              <div
                style={{ textAlign: "right", width: "50%", marginLeft: "auto" }}
              >
                <Box
                  id="user"
                  bgcolor="white"
                  borderRadius={12}
                  boxShadow={3}
                  p={3}
                  mt={4}
                  style={{ marginBottom: "10px" }}
                >
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item style={{ marginLeft: "auto" }}>
                      <Avatar
                        alt="Profile Picture"
                        src="https://media.tenor.com/E_NB8O85ZQkAAAAM/elephant.gif"
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="h5">{displayName}</Typography>
                    </Grid>
                  </Grid>
                  <Box mt={2}>
                    <Typography variant="body1">
                      Can you say something
                    </Typography>
                  </Box>
                </Box>
              </div>

              <div
                style={{ textAlign: "left", width: "80%", marginRight: "auto" }}
              >
                <Box
                  id="ai"
                  bgcolor="white"
                  borderRadius={8}
                  boxShadow={3}
                  p={3}
                  mt={4}
                >
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <Avatar
                        alt="Profile Picture"
                        src="/images/profile/pccat.gif"
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="h5">AiFren</Typography>
                    </Grid>
                  </Grid>
                  <Box mt={2}>
                    <Typography variant="body1">{getRandomEntry()}</Typography>
                  </Box>
                </Box>
              </div>
              {aiContent ? (
                <>
                  <div
                    style={{
                      textAlign: "right",
                      width: "50%",
                      marginLeft: "auto",
                    }}
                  >
                    <Box
                      id="user"
                      bgcolor="white"
                      borderRadius={12}
                      boxShadow={3}
                      p={3}
                      mt={4}
                      style={{ marginBottom: "10px" }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item style={{ marginLeft: "auto" }}>
                          <Avatar
                            alt="Profile Picture"
                            src="https://media.tenor.com/E_NB8O85ZQkAAAAM/elephant.gif"
                          />
                        </Grid>
                        <Grid item>
                          <Typography variant="h5">{displayName}</Typography>
                        </Grid>
                      </Grid>

                      <Box mt={2}>
                        <Typography variant="body1">
                          {`I've ${sendUserdata.userDegenBalance} and ${sendUserdata.userChannelSubs} subs.
        I'm paying ${sendUserdata.userPaidForSubscriptions} for ${sendUserdata.userSubscriptions} subscriptions.
        My daily Alfa Amount is ${sendUserdata.userDailyAlfa}. My Stake Cashback is ${sendUserdata.userStakeCashback}.`}
                          Now Can you say something about my data? And Elephants
                          are so fun!
                        </Typography>
                      </Box>
                    </Box>
                  </div>

                  {/* AI kutusu */}
                  <div
                    style={{
                      textAlign: "left",
                      width: "80%",
                      marginRight: "auto",
                    }}
                  >
                    <Box
                      id="ai"
                      bgcolor="white"
                      borderRadius={8}
                      boxShadow={3}
                      p={3}
                      mt={4}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <Avatar
                            alt="Profile Picture"
                            src="/images/profile/pccat.gif"
                          />
                        </Grid>
                        <Grid item>
                          <Typography variant="h5">AiFren</Typography>
                        </Grid>
                      </Grid>
                      <Box mt={2}>
                        <Typography variant="body1">
                          <div
                            dangerouslySetInnerHTML={{ __html: aiContent }}
                          />
                        </Typography>
                      </Box>
                    </Box>
                  </div>
                </>
              ) : null}

              <Box mt={2} display="flex">
                <TextField
                  variant="outlined"
                  fullWidth
                  value={`I've ${sendUserdata.userDegenBalance} and ${sendUserdata.userChannelSubs} subs.
 I'm paying ${sendUserdata.userPaidForSubscriptions} for ${sendUserdata.userSubscriptions} subscriptions.
 My daily Alfa Amount is ${sendUserdata.userDailyAlfa}. My Stake Cashback is ${sendUserdata.userStakeCashback}`}
                  disabled
                />
              </Box>
              <Box mt={2} textAlign="center">
                <Grid container spacing={5} alignItems="center">
                  <Grid item>
                    <TextField
                      variant="outlined"
                      fullWidth
                      value={`Holding ${bleuBalance} $BLEU`}
                      disabled
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      select
                      label="Language (Beta (may not work))"
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      variant="outlined"
                      fullWidth
                    >
                      {[
                        "English",
                        "Español",
                        "Français",
                        "Deutsch",
                        "Türkçe",
                        "한국인",
                        "ประเทศไทย",
                        "Bahasa Indonesia",
                        "Português",
                        "Italiano",
                      ].map((language) => (
                        <MenuItem key={language} value={language}>
                          {language}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item>
                    {isSubMe ? (
                      isGenerating ? (
                        <Button
                          variant="contained"
                          disableElevation
                          color="secondary"
                          disabled
                        >
                          Generating...
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
                        color="primary"
                        href="https://www.alfafrens.com/channel/0x27bf87dcaf7121715ac6b8addf2085a62be7ea0d"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ backgroundColor: "black", marginTop: "20px" }}
                      >
                        <Typography variant="button" sx={{ color: "green" }}>
                          AI is Only for Subs | Subscribe for 500 DEGENx/mo
                        </Typography>
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </>
      </DashboardCard>
    </PageContainer>
  );
};

export default AiPage;
