import Web3 from "web3";
import axios from "axios";

export default async function handler(req, res) {
  const { subscriber, channel } = req.query;
  const contractAddress = "0x8e243a7accd5eb76ab8d1559ff1402c95a0e5399";
  const proxyAddress = "0x905Cf6aDF9510EE12C78dD9c6A5445320db24342";
  const apiKey = process.env.BASESCAN_API_KEY;
  const ethereumRpcUrl = "https://mainnet.base.org";

  try {
    // ABI'yi alın
    const response = await axios.get(
      `https://api.basescan.org/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`
    );

    const contractABI = JSON.parse(response.data.result);

    // Web3 sağlayıcısını ayarlayın
    const web3 = new Web3(new Web3.providers.HttpProvider(ethereumRpcUrl));

    // Kontratı oluşturun
    const contract = new web3.eth.Contract(contractABI, proxyAddress);

    const result = await contract.methods
      .stakedBalanceOf(subscriber, channel)
      .call();

    // BigInt değerleri stringe dönüştür
    const resultStringified = {
      balance: result.toString(),
    };

    res.status(200).json({ result: resultStringified });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching staked balances" });
  }
}
