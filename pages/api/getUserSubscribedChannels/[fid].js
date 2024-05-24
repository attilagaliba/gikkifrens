// /src/api/getUserSubscribedChannels/[fid].js

import axios from 'axios';

export default async function handler(req, res) {
  const { fid } = req.query;
  const { skip } = req.query;

  try {
    const response = await axios.get(`https://alfafrens.com/api/v0/getUserSubscribedChannels?fid=${fid}&first=20&skip=${skip}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
