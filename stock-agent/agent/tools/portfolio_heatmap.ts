import { defineTool } from "eve/tools";
import { z } from "zod";

type Position = {
  symbol: string;
  shares: number;
  avgCost: number;
};

export default defineTool({
  description: "Track a portfolio of stock positions and show a text heatmap of P&L. Use this for portfolio tracking, position monitoring, and gain/loss analysis.",
  inputSchema: z.object({
    action: z.enum(["show", "add", "remove", "clear"]).describe("show=display portfolio, add=add position, remove=remove position, clear=reset"),
    symbol: z.string().optional().describe("Stock ticker symbol"),
    shares: z.number().optional().describe("Number of shares"),
    avgCost: z.number().optional().describe("Average cost per share"),
  }),
  async execute({ action, symbol, shares, avgCost }) {
    const store = new PortfolioStore();
    
    switch (action) {
      case "add": {
        if (!symbol || shares == null || avgCost == null) {
          return { error: "symbol, shares, and avgCost required for add" };
        }
        store.add({ symbol: symbol.toUpperCase(), shares, avgCost });
        return { ok: true, message: `Added ${shares} shares of ${symbol.toUpperCase()} @ $${avgCost}` };
      }
      case "remove": {
        if (!symbol) return { error: "symbol required for remove" };
        store.remove(symbol.toUpperCase());
        return { ok: true, message: `Removed ${symbol.toUpperCase()}` };
      }
      case "clear": {
        store.clear();
        return { ok: true, message: "Portfolio cleared" };
      }
      case "show": {
        const positions = store.getAll();
        if (positions.length === 0) {
          return { portfolio: [], summary: "Portfolio is empty. Use 'add' to add positions." };
        }
        const totalCost = positions.reduce((s, p) => s + p.shares * p.avgCost, 0);
        const rows = positions.map(p => ({
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

class PortfolioStore {
  private static storage = new Map<string, Position>();

  getAll(): Position[] {
    return Array.from(PortfolioStore.storage.values());
  }

  add(pos: Position): void {
    PortfolioStore.storage.set(pos.symbol, pos);
  }

  remove(symbol: string): void {
    PortfolioStore.storage.delete(symbol);
  }

  clear(): void {
    PortfolioStore.storage.clear();
  }
}
