"use client";
import React, { useEffect, useState } from "react";
import { fetchChannelData } from "../func/galiba";

const App: React.FC = () => {
  const [channelData, setChannelData] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChannelData(
          "0x35594acfed507027a32d7d05dc77015703a1bb8c"
        );
        setChannelData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateStakeIncome = () => {
    if (!channelData) return "N/A";
    const income =
      ((channelData.totalSubscriptionFlowRate /
        380517503805.174 /
        channelData.numberOfSubscribers /
        500) *
        channelData.stakeToIncomeRatio *
        60 *
        60 *
        24 *
        30) /
      1000000000000;
    return income.toFixed(2);
  };

  const calculateStakeForOneAlfa = () => {
    if (!channelData) return "N/A";
    const stake =
      (channelData.estimatedEarningsPerSecond * 60 * 60 * 24 * 30) /
      10000000000;
    return stake.toFixed(2);
  };

  const calculateChannelCost = () => {
    if (!channelData) return "N/A";
    const cost =
      channelData.totalSubscriptionFlowRate /
      380517503805.174 /
      channelData.numberOfSubscribers;
    return cost.toFixed(0);
  };


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span style={styles.label}>Stake Income:</span>
        <span style={styles.value}>{calculateStakeIncome()}</span>
      </div>
      <div style={styles.card}>
        <span style={styles.label}>Stake for 1 Alfa:</span>
        <span style={styles.value}>{calculateStakeForOneAlfa()}</span>
      </div>
      <div style={styles.card}>
        <span style={styles.label}>Channel Cost:</span>
        <span style={styles.value}>{calculateChannelCost()}</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100vh",
    fontSize: "1.2rem",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    padding: "0 20px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    minWidth: "150px",
  },
  label: {
    marginBottom: "10px",
  },
  value: {
    color: "#0070f3",
  },
};

export default App;
