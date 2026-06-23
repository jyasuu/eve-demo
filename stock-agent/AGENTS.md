# Stock Analysis Eve Agent

This is a Vercel Eve agent that analyzes stocks using Yahoo Finance data via yfinance-mcp-server with the opencode.ai Big Pickle model.

## Architecture

- **Eve agent** (`agent/`) — stock market analyst persona with MCP connection to yfinance
- **Model** (`agent/agent.ts`) — uses `@ai-sdk/openai-compatible` pointing at `https://opencode.ai/zen/v1` with model `big-pickle` (free, no API key). Context window: 200K tokens via `modelContextWindowTokens`
- **yfinance-mcp-server** — Docker container exposing 25+ Yahoo Finance tools over HTTP/SSE at `localhost:8080/mcp`
- **Connection** (`agent/connections/yfinance.ts`) — MCP client connection to yfinance, tools prefixed with `connection__yfinance__`
- **Skills** — `stock-analysis.md`, `earnings-analysis.md`, `options-analysis.md`, `taiwan-market-daily/SKILL.md`
- **Subagent** — `technical_analyst` for delegated chart pattern analysis (also on big-pickle)
- **Schedule** — daily market briefing weekdays at 6:30 AM (`schedules/market-briefing.md`)
- **Custom tool** — `portfolio_heatmap.ts` for tracking positions with P&L

## Development

Before writing code, read the relevant guide in `node_modules/eve/docs/`.

Key files:
- `agent/instructions.md` — agent identity and guidelines
- `agent/agent.ts` — model config (opencode.ai big-pickle, 200K context)
- `agent/connections/yfinance.ts` — MCP connection config (update URL for production)
- `agent/subagents/technical_analyst/` — subagent with its own instructions and skills
- `agent/tools/portfolio_heatmap.ts` — custom portfolio tracking tool
- `agent/skills/stock-analysis.md`, `earnings-analysis.md`, `options-analysis.md` — loadable skills
- `agent/schedules/market-briefing.md` — cron-triggered daily briefing

## Tools available

The yfinance connection exposes 25+ tools including:
- `get_quote`, `get_profile`, `get_info` — quotes & company info
- `get_historical_data`, `download_data` — historical prices
- `get_income_statement`, `get_balance_sheet`, `get_cashflow` — financials
- `get_recommendations`, `get_price_target` — analyst ratings
- `get_option_chain`, `get_option_expirations` — options
- `search_tickers`, `get_news` — search & news
- `generate_report` — comprehensive HTML report

## Running programmatic queries

```ts
import { Client } from "eve/client";

const client = new Client({ host: "http://localhost:3000" });
const session = client.session();
const response = await session.send("Analyze TW stock");
const result = await response.result();
console.log(result.message);
```
