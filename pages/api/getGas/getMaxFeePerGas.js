// pages/api/dune.js
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res) {
  const url = "https://www.alfafrens.com/api/trpc/services.getMaxFeePerGas";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
