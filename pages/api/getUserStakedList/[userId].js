import axios from "axios";

export default async function handler(req, res) {
  const userId = req.query.userId.toLowerCase();

  if (!userId) {
    // If userId is not provided in the request, return a 400 (Bad Request) response
    return res.status(400).json({ error: "userId parameter is required" });
  }

  if (req.method === "GET") {
    try {
      const url = "https://base-mainnet.subgraph.x.superfluid.dev";
      const response = await axios.post(url, {
        operationName: null,
        variables: { quUserId: userId },
        query: `
        query ($quUserId: ID = "") {
            account(id: $quUserId) {
              id
              poolMemberships(where: {isConnected: true}) {
                pool {
                  flowRate
                  admin {
                    id
                  }
                  adjustmentFlowRate
                  totalBuffer
                  perUnitFlowRate
                  perUnitSettledValue
                  updatedAtTimestamp
                  totalUnits
                  totalConnectedUnits
                  poolMembers(where: {isConnected: true, account_: {id: $quUserId}}) {
                    units
                    account {
                      id
                    }
                    syncedPerUnitFlowRate
                    syncedPerUnitSettledValue
                    totalAmountClaimed
                  }
                }
                units
                totalAmountClaimed
                syncedPerUnitSettledValue
                syncedPerUnitFlowRate
              }
            }
          }
          `,
      });
      // If the request is successful, return the data with a 200 (OK) response
      res.status(200).json(response.data.data);
    } catch (error) {
      // If there's an error, return a 500 (Internal Server Error) response
      res.status(500).json({ error: error.message });
    }
  } else {
    // If an unsupported HTTP method is used, return a 405 (Method Not Allowed) response
    res.status(405).end();
  }
}
