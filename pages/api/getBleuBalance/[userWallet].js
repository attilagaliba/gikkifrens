// /src/api/getUserSubscribedChannels/[fid].js

import axios from "axios";

export default async function handler(req, res) {
  const { userWallet } = req.query;
  const apiKey = process.env.BASESCAN_API_KEY;
  try {
    const response = await axios.get(
      `https://api.basescan.org/api?module=account&action=tokenbalance&contractaddress=0xbf4db8b7a679f89ef38125d5f84dd1446af2ea3b&address=${userWallet}&tag=latest&apikey=${apiKey}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}


