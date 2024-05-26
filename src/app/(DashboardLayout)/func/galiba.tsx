import axios from "axios";

export const getUserByFid = async (fid: number) => {
  try {
    const response = await axios.get(`/api/getUserByFid/${fid}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const getUserByFidFFC = async (fid: number) => {
  try {
    const response = await axios.get(`/api/getUserByFidFFC/${fid}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const getUserAddress = async (fid: number) => {
  try {
    const response = await axios.get(`/api/getUserAddress/${fid}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

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

export const getUserTrasfers = async (userAddress: string) => {
  try {
    const response = await axios.get(`/api/getUserTrasfers/${userAddress}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user transfers:", error);
    return null;
  }
};

export const getSubsRew = async (fid: number) => {
  let skip = 0;
  let hasMore = true;
  let allChannels: any[] = [];

  while (hasMore) {
    try {
      const response = await axios.get(`/api/getSubsRew/${fid}?first=${skip}`);
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
      skip += 50;
    } catch (error) {
      console.error("Error fetching data:", error);
      hasMore = false;
    }
  }
  return allChannels;
};

export const getChaRew = async (fid: number) => {
  try {
    const response = await axios.get(`/api/getChaRew/${fid}`);
    const getReward = response.data.data.monthlyApD * response.data.data.cost;
    return getReward.toFixed(2);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};
