import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "Agent can add a portfolio position and display the portfolio.",
  async test(t) {
    await t.send("Add 10 shares of TSLA at $200 per share to my portfolio");
    t.succeeded();
    t.calledTool("portfolio_heatmap");
    t.check(t.reply, includes("TSLA"));
    await t.send("Show my portfolio");
    t.succeeded();
    t.calledTool("portfolio_heatmap");
  },
});
