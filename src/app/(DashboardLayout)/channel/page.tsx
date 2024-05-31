/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
import RecentTransactions from "@/app/(DashboardLayout)/components/dashboard/RecentTransactions";
import SubsTable from "@/app/(DashboardLayout)/components/dashboard/SubsTable";
import StakersTable from "@/app/(DashboardLayout)/components/dashboard/StakersTable";
import Blog from "@/app/(DashboardLayout)/components/dashboard/Blog";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import ChannelStats from "@/app/(DashboardLayout)/components/dashboard/ChannelStats";
import { useProfile } from "@farcaster/auth-kit";
import axios from "axios";
import {
  getUserByFid,
  getUserByFidFFC,
  getChaRew,
  getUserByAddress,
  fetchChannelData,
} from "../func/galiba";

const Dashboard = () => {
  const [degenPrice, setDegenPrice] = useState(0.01);
  const [userMinData, setUserMinData] = useState({
    channeladdress: null,
    channelAddress: [],
  });
  const [userChannelSubList, setUserChannelSubList] = useState<any>(null);
  const [userChannelStakerList, setUserChannelStakerList] = useState<any>(null);

  const [channelData, setChannelData] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [numberProgg, setNumberProgg] = useState(0);

  const [fid, setFid] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [custody, setCustody] = useState<string | null>(null);

  const [channelRewardGet, setChannelRewardGet] = useState(0);

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
      if (fid && fid > 0) {
        const userData = await getUserByFid(fid);
        setUserMinData(userData);
      }
    };
    fetchData();
  }, [fid]);

  useEffect(() => {
    const fetchData = async () => {
      if (fid && fid > 0) {
        const userData = await getChaRew(fid);
        setChannelRewardGet(Number(userData));
      }
    };
    fetchData();
  }, [fid]);

  const getUserProfileData = async (fid: number) => {
    const userData = await getUserByFidFFC(fid);
    return userData;
  };

  const getUserProfileDataFromAlfa = async (userAddress: any) => {
    const userData = await getUserByAddress(userAddress);
    return userData;
  };

  const fetchChannelSubscribersAndStakes = async (channelAddress: string) => {
    let skip = 0;
    let hasMore = true;
    let allList: any[] = [];
    let totalMembers = 0;
    let whatCount = 0;
    try {
      const initialResponse = await axios.get(
        `/api/getChannelSubscribersAndStakes/${channelAddress}?skip=0`
      );
      totalMembers = initialResponse.data.totalMembers || 0;
    } catch (error) {
      console.error("Error fetching initial data:", error);
      return;
    }

    while (hasMore) {
      try {
        const response = await axios.get(
          `/api/getChannelSubscribersAndStakes/${channelAddress}?skip=${skip}`
        );
        const sleep = (ms: number | undefined) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        const channels = await Promise.all(
          response.data.members.map(
            async (item: {
              profileimgurl: any;
              handle: any;
              fid: number;
              totalSubscriptionOutflowAmount: any;
              totalSubscriptionOutflowRate: any;
              currentStaked: number;
              isStaked: any;
              isSubscribed: any;
              subscriber: { id: any };
            }) => {
              // const userProfileData = await getUserProfileData(item.fid);
              await sleep(500);

              whatCount = whatCount + 1;

              setNumberProgg(whatCount);
              // const userProfilePfp = userProfileData.find(
              //   (data: { type: string }) => data.type === "USER_DATA_TYPE_PFP"
              // );
              // const userProfileDisplay = userProfileData.find(
              //   (data: { type: string }) =>
              //     data.type === "USER_DATA_TYPE_DISPLAY"
              // );

              return {
                fid: item.fid,
                totalSubscriptionOutflowAmount:
                  item.totalSubscriptionOutflowAmount,
                totalSubscriptionOutflowRate: item.totalSubscriptionOutflowRate,
                currentStaked: (item.currentStaked / 100000000000000).toFixed(
                  2
                ),
                isStaked: item.isStaked,
                isSubscribed: item.isSubscribed,
                subscriber: item.subscriber.id,
                userPfp: item.profileimgurl,
                userDisplayName: item.handle,
              };
            }
          )
        );

        allList = [...allList, ...channels];
        hasMore = response.data.hasMore;
        skip += 50;

        // Update loading progress
        setLoadingProgress((prevProgress) =>
          Math.min(prevProgress + (channels.length / totalMembers) * 100, 100)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        hasMore = false;
      }
    }
    setUserChannelStakerList(allList.filter((item) => item.isStaked));
    setUserChannelSubList(allList.filter((item) => item.isSubscribed));
  };

  useEffect(() => {
    if (userMinData && userMinData.channeladdress) {
      fetchChannelSubscribersAndStakes(userMinData.channeladdress);
    }
  }, [userMinData]);

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

  const calculateStakeIncome = () => {
    if (!channelData) return "N/A";
    const income =
      ((channelData.totalSubscriptionFlowRate /
        380517503805.174 /
        channelData.numberOfSubscribers /
        500) *
        channelData.stakeToIncomeRatio *
        60 *
        60 *
        24 *
        30) /
      1000000000000;
    return income.toFixed(2);
  };

  const calculateStakeForOneAlfa = () => {
    if (!channelData) return "N/A";
    const stake =
      (channelData.estimatedEarningsPerSecond * 60 * 60 * 24 * 30) /
      10000000000;
    return stake.toFixed(2);
  };

  const calculateChannelCost = () => {
    if (!channelData) return "N/A";
    const cost =
      channelData.totalSubscriptionFlowRate /
      380517503805.174 /
      channelData.numberOfSubscribers;
    return cost.toFixed(0);
  };

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats
                  title={"Subs"}
                  number={channelData?.numberOfSubscribers}
                  unit={""}
                  image={
                    "https://media.tenor.com/N8PjzW2fyIcAAAAM/peepogiggle.gif"
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats
                  title={"Stakers"}
                  number={channelData?.numberOfStakers}
                  unit={""}
                  image={
                    "https://media.tenor.com/hVRzRZnx-YsAAAAM/pepe-the-frog-sitting-chillin.gif"
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats
                  title={"Stake Ratio"}
                  number={calculateStakeForOneAlfa()}
                  unit={"Degen"}
                  image={"https://c.tenor.com/71rFa0hBgU4AAAAC/tenor.gif"}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats
                  title={"Channel Cost"}
                  number={calculateChannelCost()}
                  unit={"Degen"}
                  image={
                    "https://media.tenor.com/Xq6Ij1fSSqMAAAAM/pepe-money.gif"
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {channelRewardGet !== 0 ? (
                  <ChannelStats
                    title={"Reward"}
                    number={channelRewardGet}
                    unit={"Alfa"}
                    image={"https://media.tenor.com/_4v3Nx_hzjwAAAAM/peepo.gif"}
                  />
                ) : (
                  <ChannelStats
                    title={"Reward"}
                    number={"Please Sub"}
                    unit={"@degenfans"}
                    image={"https://media.tenor.com/_4v3Nx_hzjwAAAAM/peepo.gif"}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats
                  title={"Stakes"}
                  number={(
                    channelData?.currentStaked / 100000000000000
                  ).toFixed(2)}
                  unit={"Alfa"}
                  image={"https://c.tenor.com/KudEsy5UPSoAAAAd/tenor.gif"}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            {userChannelSubList?.length > 0 ? (
              <SubsTable userSubs={userChannelSubList} />
            ) : (
              <>
                Loading Subs List (This processing time may take longer
                depending on your number of subs. Please do not close the page.)
                -{" "}
                {(
                  (((numberProgg / 2) * 100) / channelData?.numberOfStakers +
                    channelData?.numberOfSubscribers) /
                  3
                ).toFixed(2)}
                %
              </>
            )}
          </Grid>
          <Grid item xs={12} lg={6}>
            {userChannelStakerList?.length > 0 ? (
              <StakersTable userSubs={userChannelStakerList} />
            ) : (
              <>
                Loading Stakers List (This processing time may take longer
                depending on your number of stakers. Please do not close the
                page.) -{" "}
                {(
                  (((numberProgg / 2) * 100) / channelData?.numberOfStakers +
                    channelData?.numberOfSubscribers) /
                  3
                ).toFixed(2)}
                %
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
