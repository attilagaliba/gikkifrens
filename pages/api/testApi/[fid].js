// pages/api/getCastsByFid.js

import { api } from 'gikkilib';

export default async function handler(req, res) {
  const { fid } = req.query;

  if (!fid) {
    return res.status(400).json({ error: 'fid parameter is required' });
  }

  try {
    const data = await api.getCastsByFid(fid);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
}
