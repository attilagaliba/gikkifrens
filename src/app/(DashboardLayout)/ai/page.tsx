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

  const [aiContent, setAiContent] = useState<string | null>(null);
  const [sendUserdata, setSendUserdata] = useState<any>({
    userDegenBalance: "278.27 Degen",
    userDailyAlfa: "58.27 Alfa",
    userStakeCashback: "6930 Degen",
    userChannelSubs: 38,
    userChannelEarnings: "4750 Degen",
    userBleuBalance: "125448413 Bleu",
    userDeposit: "9316 Degen",
    userWithraw: "1610 Degen",
    userSubscriptions: 8,
    userPaidForSubscriptions: "6500 Degen",
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

  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSubEarnings, setTotalSubEarnings] = useState(0);


  return (
    <PageContainer title="Bleu AI" description="GikkiFrens Ai">
      <DashboardCard>
        <>
          <Grid container style={{ width: "100%", justifyContent: "center" }}>
            <Grid item xs={12} sm={8} md={10}>
              <Box bgcolor="white" borderRadius={8} boxShadow={3} p={3} mt={4}>
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
                    {aiContent ? (
                      <div dangerouslySetInnerHTML={{ __html: aiContent }} />
                    ) : (
                      getRandomEntry()
                    )}
                    {!aiContent && "\u00A0"} {/* non-breaking space */}
                  </Typography>
                </Box>
              </Box>
              <Box mt={2} display="flex">
                <TextField
                  variant="outlined"
                  fullWidth
                  value={
                    "Hey bud! Can you analyse my Alfafrens data, I hope you do well. I pay for every request tho!"
                  }
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
                    {isGenerating ? (
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
