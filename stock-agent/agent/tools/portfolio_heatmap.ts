import { defineState } from "eve/context";
import { defineTool } from "eve/tools";
import { z } from "zod";

type Position = {
  symbol: string;
  shares: number;
  avgCost: number;
};

const portfolio = defineState("stock-agent.portfolio", () => [] as Position[]);

export default defineTool({
  description: "Track a portfolio of stock positions and show a text heatmap of P&L. Use this for portfolio tracking, position monitoring, and gain/loss analysis.",
  inputSchema: z.object({
    action: z.enum(["show", "add", "remove", "clear"]).describe("show=display portfolio, add=add position, remove=remove position, clear=reset"),
    symbol: z.string().optional().describe("Stock ticker symbol"),
    shares: z.number().optional().describe("Number of shares"),
    avgCost: z.number().optional().describe("Average cost per share"),
  }),
  async execute({ action, symbol, shares, avgCost }) {
    switch (action) {
      case "add": {
        if (!symbol || shares == null || avgCost == null) {
          return { error: "symbol, shares, and avgCost required for add" };
        }
        const pos: Position = { symbol: symbol.toUpperCase(), shares, avgCost };
        portfolio.update((prev) => [...prev, pos]);
        return { ok: true, message: `Added ${shares} shares of ${symbol.toUpperCase()} @ $${avgCost}` };
      }
      case "remove": {
        if (!symbol) return { error: "symbol required for remove" };
        portfolio.update((prev) => prev.filter((p) => p.symbol !== symbol.toUpperCase()));
        return { ok: true, message: `Removed ${symbol.toUpperCase()}` };
      }
      case "clear": {
        portfolio.update(() => []);
        return { ok: true, message: "Portfolio cleared" };
      }
      case "show": {
        const positions = portfolio.get();
        if (positions.length === 0) {
          return { portfolio: [], summary: "Portfolio is empty. Use 'add' to add positions." };
        }
        const totalCost = positions.reduce((s, p) => s + p.shares * p.avgCost, 0);
        const rows = positions.map((p) => ({
          symbol: p.symbol,
          shares: p.shares,
          avgCost: p.avgCost,
          costBasis: p.shares * p.avgCost,
        }));
        return {
          portfolio: rows,
          summary: {
            totalPositions: positions.length,
            totalCostBasis: totalCost,
          },
        };
      }
    }
  },
});
