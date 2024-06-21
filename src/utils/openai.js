const OpenAI = require("openai");

const apiKey = "sk-proj-TKV1gK9fJaVrfRqBeM5jT3BlbkFJaT6QLt9YbFQpwI9PwQZq";
const openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });

export async function askAi(
  getUserData,
  getLanguage,
  degenPrice,
  bleuPrice
) {
  console.log(getLanguage);

  const systemDescription = `
  System:
  - You can subscribe monthly by paying "Degen" as a user, and in return, you earn "Alfa" monthly.
  - You can claim the Alfars you earned whenever you want to your account.
  - By staking "Alfa", you earn "degen" monthly.
  Calculations are done instantly. 
  For example, the amounts you earn or pay monthly are deducted from your account every second. 
  If you subscribe to 500 Degen, 500 degen is deducted from your account every second and reaches 0 at the end of the month. 
  So, if you unsubscribe, you only pay for the time you subscribed, or even if you have only 100 degen in your account, you can subscribe to a channel or channels that cost 500 degen.
  Additionally, we can collect subscribers by opening our own channel, and we receive monthly payments per subscriber to our own channel.
  `;

  const aiData = {
    dataUnits: {
      userDegenBalance: "DEGEN",
      userDailyAlfa: "ALFA",
      userStakeCashback: "DEGEN",
      userChannelEarnings: "DEGEN",
      userBleuBalance: "BLEU",
      userDeposit: "DEGEN",
      userWithraw: "DEGEN",
      userPaidForSubscriptions: "DEGEN",
    },
    dataDescription: {
      userDegenBalance: "User Current Degen Balance",
      userSubscriptions: "User Subscription Count",
      userPaidForSubscriptions: "User Paid Degen for Subscriptions / monthly",
      userDailyAlfa: "User's Daily Alfa Reward",
      userStakeCashback: "User's Income Degen from Stakes / monthly",
      userChannelEarnings:
        "User's Income Degen from User's Channel Subscriptions / monthly",
    },
  };

  const languageAnswer = getLanguage;

  const userData = getUserData;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You must give the answer with BB codes. * 
        You write long answers and detailed one-page essays like a professor but urban language. *
        You are someone who detailed analyzes data. 
        You are a funny person who speaks urban language. 
        Sometimes you mess with the data.
        System: ${systemDescription} *
        Data Info: ${aiData} * 
        You must give the answer with BBcode Format with modern style. * 
        You give suggestions for the user's daily earnings and how to earn more. 
        You also give advice on how many subscribers you need to have to double your earnings, 
        how much alpha stake you need to make, and what you should do without reducing your expenses. 
        * You must give the answer with BBcode Format.
        And you are funny person.
        *You write long answers and detailed one-page essays like a professor.
        * and congratulate for if holding userBleuBalance is not zero * Dont want sell Bleu *
        * Answer Language: ${languageAnswer}`,
      },
      {
        role: "user",
        content: `Can you calculate ana detailed anayzes my data? 
        I want a 10000 character article. *
        Analyze my data in sentences. I don't want a list.
        * Degen Price: 1 DEGEN = ${degenPrice} USD
        * ALFA has no financial equivalent.
        * 1 "BLEU" = ${bleuPrice} USD
        * Its my Data: ${JSON.stringify(userData)}
        * You must give the answer with BB codes.
        * Lastly, say you love elephants and talk a little about elephants.
        * Answer ${languageAnswer} please`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0];
}