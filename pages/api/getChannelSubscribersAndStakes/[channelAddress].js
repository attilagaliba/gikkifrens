// /src/api/getUserSubscribedChannels/[fid].js

import axios from 'axios';

export default async function handler(req, res) {
  const { channelAddress } = req.query;
  const { skip } = req.query;

  try {
    const response = await axios.get(`https://alfafrens.com/api/v0/getChannelSubscribersAndStakes?channelAddress=${channelAddress}&first=50&skip=${skip}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
