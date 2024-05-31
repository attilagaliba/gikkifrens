// /src/api/getUserSubscribedChannels/[fid].js

import axios from "axios";

export default async function handler(req, res) {
  const { userAddress } = req.query;

  try {
    const response = await axios.get(
      `https://alfafrens.com/api/v0/getUserByAddress?userAddress=${userAddress}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
