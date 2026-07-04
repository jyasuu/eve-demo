import { defineMcpClientConnection } from "eve/connections";

export default defineMcpClientConnection({
  url: "https://unproving-nondeferent-malik.ngrok-free.dev/mcp",
  description:
    "Yahoo Finance stock market data: quotes, financials, historical data, earnings, recommendations, options, news, and company profiles. Use for any stock, ticker, or market analysis queries.",
});
