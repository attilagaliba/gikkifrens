"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

// FlowingBalance bileşenini dinamik olarak yükleyin ve istemci tarafında çalışmasını sağlayın
const FlowingBalance = dynamic(() => import("./FlowingBalance"), {
  ssr: false,
});

const App: React.FC = () => {
  const [accountData, setAccountData] = useState<any>(null); // Hesap verilerini saklamak için state tanımı

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "https://base-mainnet.subgraph.x.superfluid.dev/"; // GraphQL endpoint adresi
        const variables = { id: "0xb730500032a3ccc7f4770235ca62ed40d473df75" }; // Değişkenler

        const response = await axios.post(url, {
          operationName: null,
          query: `
              query ($id: ID!) {
                account(id: $id) {
                  createdAtTimestamp
                  createdAtBlockNumber
                  isSuperApp
                  updatedAtBlockNumber
                  updatedAtTimestamp
                  accountTokenSnapshots {
                    accountTokenSnapshotLogs(orderBy: timestamp, orderDirection: desc, first: 1) {
                      balance
                      totalNetFlowRate
                      timestamp
                      token {
                        name
                      }
                      totalInflowRate
                      totalOutflowRate
                      totalCFANetFlowRate
                      totalAmountStreamedIn
                    }
                    balanceUntilUpdatedAt
                  }
                }
              }
            `,
          variables: variables,
        });

        // Axios ile alınan veriyi state'e kaydet
        setAccountData(response.data.data.account);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchData();
  }, []);
  console.log(accountData);
  return (
    <div
      style={{
        display: "flex",
        fontSize: "1.2rem",
        fontWeight: "bold",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: "135px", margin: "auto" }}>
        {accountData ? (
          <>
            <FlowingBalance
              startingBalance={BigInt(accountData.accountTokenSnapshots[0].accountTokenSnapshotLogs[0].balance)}
              startingBalanceDate={accountData.accountTokenSnapshots[0].accountTokenSnapshotLogs[0].timestamp}
              flowRate={BigInt(-accountData.accountTokenSnapshots[0].accountTokenSnapshotLogs[0].totalNetFlowRate)}
            />
          </>
        ) : (
          <>loading</>
        )}
      </div>
    </div>
  );
};

export default App;
