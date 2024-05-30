import axios from "axios";
////Get User API ALFA
export const getUserByFid = async (fid: any) => {
  try {
    const response = await axios.get(`/api/getUserByFid/${fid}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
////Chack User Sub me User API ALFA
export const checkUser = async (fid: any) => {
  try {
    const response = await axios.get(`/api/checkUser/${fid}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
////Get User API Farcaster
export const getUserByFidFFC = async (fid: any) => {
  try {
    const response = await axios.get(`/api/getUserByFidFFC/${fid}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
////Get User Address Airstack
export const getUserAddress = async (fid: any) => {
  try {
    const response = await axios.get(`/api/getUserAddress/${fid}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
////Get User Staked List
export const getUserStakedList = async (userAddress: string) => {
  try {
    const response = await axios.get(`/api/getUserStakedList/${userAddress}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
////Get User Balance Superfluid
export const getUserBalance = async (userAddress: string) => {
  try {
    const response = await axios.get(`/api/getUserBalance/${userAddress}`);
    return response.data.account.accountTokenSnapshots[0]
      .accountTokenSnapshotLogs[0];
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

////Get User Balance History
export const getUserBalanceHistory = async (userAddress: string) => {
  try {
    const response = await axios.get(`/api/getUserBalance/${userAddress}`);
    return response.data.account;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

////Get User Transfers Superfluid
export const getUserTrasfers = async (userAddress: string) => {
  try {
    const response = await axios.get(`/api/getUserTrasfers/${userAddress}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user transfers:", error);
    return null;
  }
};
////Get User Subs DegenFans
export const getSubsRew = async (fid: any) => {
  let skip = 0;
  let hasMore = true;
  let allChannels: any[] = [];

  while (hasMore) {
    try {
      const response = await axios.get(`/api/getSubsRew/${fid}?first=${skip}`);
      console.log(fid, response.data.data)
      const channels = response.data.data.map((item: any) => ({
        lastUpdated: item.subTs,
        userDisplayName: item.channelName,
        userPfp: item.channelPfp,
        userChannelAlfa: (item.channelApD * item.channelCost).toFixed(2),
        userChannelCost: item.channelCost,
        channelId: item.channelAddress,
      }));

      allChannels = [...allChannels, ...channels];
      hasMore = response.data.hasMore;
      skip += 20;
    } catch (error) {
      console.error("Error fetching data:", error);
      hasMore = false;
    }
  }
  return allChannels;
};
////Get User Channel Degenfans
export const getChaRew = async (fid: any) => {
  try {
    const response = await axios.get(`/api/getChaRew/${fid}`);
    const getReward = response.data.data.monthlyApD * response.data.data.cost;
    return getReward.toFixed(2);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};
/////Get Channel Alfafren
export const fetchChannelData = async (getChannelAddress: any) => {
  try {
    const response = await axios.get(`/api/getChannel/${getChannelAddress}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching channel data:", error);
    throw error;
  }
};

/////Get User Subs

export const getUserSubscribedChannels = async (fid: any) => {
  let skip = 0;
  let hasMore = true;
  let allChannels: any[] = [];

  while (hasMore) {
    try {
      const response = await axios.get(
        `/api/getUserSubscribedChannels/${fid}?skip=${skip}`
      );
      const channels = response.data.channels.map((item: any) => ({
        title: item.title,
        profileimgurl: item.profileimgurl,
        totalSubscriptionOutflowRate: item.totalSubscriptionOutflowRate,
        totalSubscriptionOutflowAmount: item.totalSubscriptionOutflowAmount,
        channelId: item.channel.id,
        channelCost:
          item.totalSubscriptionOutflowRate === "190258751902587"
            ? 500
            : item.totalSubscriptionOutflowRate === "570776255707762"
            ? 1500
            : item.totalSubscriptionOutflowRate === "380517503805175"
            ? 1000
            : undefined, // Add a default case if none of the conditions match
      }));

      allChannels = [...allChannels, ...channels];
      hasMore = response.data.hasMore;
      skip += 20;
    } catch (error) {
      console.error("Error fetching data:", error);
      hasMore = false;
    }
  }
  return allChannels;
};

/////Get Channel Sus And Stakers
export const getChannelSubscribersAndStakes = async (
  getChannelAddress: any,
  skip: any
) => {
  try {
    const response = await axios.get(
      `/api/getChannelSubscribersAndStakes/${getChannelAddress}?skip=${skip}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching channel data:", error);
    throw error;
  }
};

// Function to fetch channel reward
const fetchChannelReward = async (fid: any) => {
  try {
    const chaReward = await getChaRew(fid);
    return typeof chaReward === "number"
      ? chaReward
      : parseFloat(chaReward) || 0;
  } catch (error) {
    console.error("Error fetching channel reward:", error);
    return "Sub";
  }
};

// Function to process and return channel details
const processChannelData = (channelData: { title: any; numberOfSubscribers: any; numberOfStakers: any; currentStaked: any; totalSubscriptionFlowRate: any; lastUpdatedTimestamp: string; }, chaReward: string | number) => {
  return {
    channelName: channelData.title,
    subscribers: channelData.numberOfSubscribers,
    stakers: channelData.numberOfStakers,
    reward: chaReward,
    stake: Number((channelData.currentStaked / 1e14).toFixed(0)),
    cost: Number(
      (channelData.totalSubscriptionFlowRate / 380517503805).toFixed(0)
    ),
    date: new Date(
      parseInt(channelData.lastUpdatedTimestamp) * 1000
    ).toISOString(),
  };
};

// Main function to get channel details
export const getChannelAlfafren = async (getChannelAddress: any, fid: any) => {
  try {
    const channelData = await fetchChannelData(getChannelAddress);
    const chaReward = await fetchChannelReward(fid);
    return processChannelData(channelData, chaReward);
  } catch (error) {
    console.error("Error getting channel details:", error);
    throw error;
  }
};
