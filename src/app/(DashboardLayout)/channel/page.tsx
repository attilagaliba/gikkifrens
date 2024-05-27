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
  getChannelAlfafren,
} from "../func/galiba";

const Dashboard = () => {
  const [degenPrice, setDegenPrice] = useState(0.01);
  const [userMinData, setUserMinData] = useState<{ channeladdress?: string[] }>(
    {}
  );
  const [userChannel, setUserChannel] = useState({});
  const [userChannelSubList, setUserChannelSubList] = useState([]);
  const [userChannelStakerList, setUserChannelStakerList] = useState([]);

  const profile = useProfile();
  const {
    isAuthenticated,
    profile: { fid, displayName, custody },
  } = profile;

  useEffect(() => {
    const fetchData = async (fid: number) => {
      const userData = await getUserByFid(fid);
      setUserMinData(userData);
    };

    if (fid && fid > 0) {
      fetchData(fid);
    }
  }, [fid]);

  useEffect(() => {
    const fetchAllData = async (channeladdress: number) => {
      const userData = await getChannelAlfafren(channeladdress, fid);
      console.log(userData);
      setUserChannel(userData);
    };

    if (userMinData.channeladdress) {
      fetchAllData(userMinData.channeladdress);
    }
  }, [userMinData]);

  useEffect(() => {
    async function getUserPfPName(fid: number) {
      const userDataGetApi = await getUserByFidFFC(fid);
      return userDataGetApi;
    }
    const fetchAllData = async (getChannelAddress: any) => {
      let skip = 0;
      let hasMore = true;
      let allList: any[] = [];
      while (hasMore) {
        try {
          const response = await axios.get(
            `/api/getChannelSubscribersAndStakes/${getChannelAddress}?skip=${skip}`
          );
          const channels = await Promise.all(
            response.data.members.map(
              async (item: {
                fid: number;
                totalSubscriptionOutflowAmount: any;
                totalSubscriptionOutflowRate: any;
                currentStaked: number;
                isStaked: any;
                isSubscribed: any;
                subscriber: { id: any };
              }) => {
                const userProfileData = await getUserPfPName(item.fid);
                const userProfilePfp = userProfileData.find(
                  (data: { type: string }) => data.type === "USER_DATA_TYPE_PFP"
                );
                const userProfileDisplay = userProfileData.find(
                  (data: { type: string }) =>
                    data.type === "USER_DATA_TYPE_DISPLAY"
                );
                return {
                  fid: item.fid,
                  totalSubscriptionOutflowAmount:
                    item.totalSubscriptionOutflowAmount,
                  totalSubscriptionOutflowRate:
                    item.totalSubscriptionOutflowRate,
                  currentStaked: (item.currentStaked / 100000000000000).toFixed(
                    2
                  ),
                  isStaked: item.isStaked,
                  isSubscribed: item.isSubscribed,
                  subscriber: item.subscriber.id,
                  userPfp: userProfilePfp ? userProfilePfp.value : "", // Eğer profil resmi varsa değerini al, yoksa boş string
                  userDisplayName: userProfileDisplay
                    ? userProfileDisplay.value
                    : "", // Eğer görüntülenen ad varsa değerini al, yoksa boş string
                };
              }
            )
          );

          allList = [...allList, ...channels];
          hasMore = response.data.hasMore;
          skip += 50;
        } catch (error) {
          console.error("Error fetching data:", error);
          hasMore = false;
        }
      }
      const chaStakerList = allList.filter((item) => item.isStaked);
      setUserChannelStakerList(chaStakerList);

      const chaSubsList = allList.filter((item) => item.isSubscribed);
      setUserChannelSubList(chaSubsList);
    };

    if (userMinData.channeladdress) {
      fetchAllData(userMinData.channeladdress);
    }
  }, [userMinData]);

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

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats
                  userChannel={userChannel}
                  title={"Subs"}
                  userData={userData}
                  degenPrice={degenPrice}
                  image={"https://c.tenor.com/71rFa0hBgU4AAAAC/tenor.gif"}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats
                  userChannel={userChannel}
                  title={"Stakers"}
                  userData={userData}
                  degenPrice={degenPrice}
                  image={
                    "https://media.tenor.com/Xq6Ij1fSSqMAAAAM/pepe-money.gif"
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats
                  userChannel={userChannel}
                  title={"Reward"}
                  userData={userData}
                  degenPrice={degenPrice}
                  image={"https://media.tenor.com/_4v3Nx_hzjwAAAAM/peepo.gif"}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChannelStats
                  userChannel={userChannel}
                  title={"Stakes"}
                  userData={userData}
                  degenPrice={degenPrice}
                  image={"https://c.tenor.com/KudEsy5UPSoAAAAd/tenor.gif"}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            {userChannelSubList.length > 0 ? (
              <SubsTable
                userSubs={userChannelSubList}
                limit={5}
                degenPrice={degenPrice}
              />
            ) : (
              <>Loading Subs List</>
            )}
          </Grid>
          <Grid item xs={12} lg={6}>
            {userChannelSubList.length > 0 ? (
              <StakersTable
                userSubs={userChannelStakerList}
                limit={5}
                degenPrice={degenPrice}
              />
            ) : (
              <>Loading Stakers List</>
            )}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
