---
name: portfolio-tool
description: Use when editing the portfolio_heatmap tool in stock-agent/agent/tools/portfolio_heatmap.ts. Covers the defineState pattern for durable session state and the tool's CRUD actions.
---

# Portfolio Heatmap Tool

File: `agent/tools/portfolio_heatmap.ts`

Custom Eve tool with durable session state using `defineState` from `eve/context`.

## defineState pattern

```ts
import { defineState } from "eve/context";

const portfolio = defineState("stock-agent.portfolio", () => [] as Position[]);
```

- First arg: unique state key (`"stock-agent.portfolio"`)
- Second arg: factory returning initial value
- Methods: `.get()`, `.update(updater)`, `.set(value)`
- State persists across turns within a session

## Tool schema

```ts
export default defineTool({
  description: "Track a portfolio of stock positions and show a text heatmap of P&L.",
  inputSchema: z.object({
    action: z.enum(["show", "add", "remove", "clear"]),
    symbol: z.string().optional(),
    shares: z.number().optional(),
    avgCost: z.number().optional(),
  }),
  async execute({ action, symbol, shares, avgCost }) { ... },
});
```

## Actions

- **`add`** -- Requires `symbol`, `shares`, `avgCost`. Appends a new position.
- **`remove`** -- Requires `symbol`. Filters matching position.
- **`clear`** -- Resets state to empty array.
- **`show`** -- Returns all positions with cost basis summary.

## Extending

To add fields (e.g., `currentPrice` for live P&L):
1. Add field to `Position` type
2. Add to input schema
3. Handle in the relevant `action` case
4. Include in `show` output
