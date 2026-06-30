import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "Agent can look up a stock quote and produce a reply mentioning the price.",
  async test(t) {
    await t.send("What is the current price of AAPL?");
    t.succeeded();
    t.calledTool("connection__yfinance__get_quote");
    t.check(t.reply, includes("AAPL"));
  },
});
