// pages/api/sendAi.js

export default async function handler(req, res) {
  const { requestData, getRandomMessage } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;

  const requestUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const makeRequest = async (retryCount = 0) => {
    try {
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = response
      const storyText = data;

      return storyText;
    } catch (error) {
      if (retryCount < 10) {
        return await makeRequest(retryCount + 1);
      } else {
        throw new Error("Failed to generate content after multiple attempts.");
      }
    }
  };

  try {
    const generatedContent = await makeRequest();
    res.status(200).json({ content: generatedContent });
  } catch (error) {
    res.status(500).json({ content: getRandomMessage });
  }
}
