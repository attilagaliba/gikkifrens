// /src/api/getUserByFid/[fid].js

import axios from 'axios';

export default async function handler(req, res) {
  const { fid } = req.query;

  try {
    const response = await axios.get(`https://alfafrens.com/api/v0/getUserByFid?fid=${fid}`);
    console.log(response.data)
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
