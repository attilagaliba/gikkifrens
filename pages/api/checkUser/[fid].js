// /src/api/checkUser/[fid].js

import axios from 'axios';

export default async function handler(req, res) {
  const { fid } = req.query;

  try {
    const response = await axios.get(`https://www.alfafrens.com/api/v0/isUserByFidSubscribedToChannel?channelAddress=0x27bf87dcaf7121715ac6b8addf2085a62be7ea0d&fid=${fid}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
