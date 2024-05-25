// fid.js

import { init, fetchQuery } from "@airstack/node";

// Airstack API anahtarını buraya yerleştirin
const API_KEY = "1c62934943b654b33ab687f28e5787992";

// Airstack API'yi başlat
init(API_KEY);

// API endpoint'i
export default async function handler(req, res) {
  // İstekten fid parametresini alın
  const { fid } = req.query;

  // Airstack GraphQL sorgusu
  const query = `
    query GetVerificationsByFid($_eq: String, $blockchain: Blockchain!) {
      Socials(input: {filter: {userId: {_eq: $_eq}}, blockchain: $blockchain}) {
        Social {
          connectedAddresses {
            address
            blockchain
          }
        }
      }
    }
  `;

  // Sorgu değişkenleri
  const variables = {
    _eq: fid,
    blockchain: "ethereum" // Varsayılan blockchain, isteğinize göre değiştirilebilir
  };

  try {
    // Airstack'den veri alın
    const { data, error } = await fetchQuery(query, variables);

    // Hata varsa
    if (error) {
      console.error("Airstack API error:", error);
      throw new Error("Airstack API error");
    }

    // Veriyi yanıt olarak gönder
    res.status(200).json(data);
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
