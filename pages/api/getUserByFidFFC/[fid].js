import axios from 'axios';

export default async function handler(req, res) {
  const { fid } = req.query;

  try {
    const response = await axios.get(`https://nemes.farcaster.xyz:2281/v1/userDataByFid?fid=${fid}`);
    const userData = response.data.messages.map(message => {
      const { type, value } = message.data.userDataBody;

        return { type, value };

    }).filter(Boolean); // Boş değerleri filtrele

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
