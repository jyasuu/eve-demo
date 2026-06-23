# Stock Analysis Eve Agent

This is a Vercel Eve agent that analyzes stocks using Yahoo Finance data via yfinance-mcp-server.

## Architecture

- **Eve agent** (`agent/`) — stock market analyst persona with MCP connection to yfinance
- **yfinance-mcp-server** — Docker container exposing 25+ Yahoo Finance tools over HTTP/SSE at `localhost:8080/mcp`
- **Connection** (`agent/connections/yfinance.ts`) — MCP client connection to yfinance, tools prefixed with `connection__yfinance__`
- **Skill** (`agent/skills/stock-analysis.md`) — deep-dive workflow loaded on demand

## Development

Before writing code, read the relevant guide in `node_modules/eve/docs/`.

Key files:
- `agent/instructions.md` — agent identity and guidelines
- `agent/connections/yfinance.ts` — MCP connection config (update URL for production)
- `agent/skills/stock-analysis.md` — stock analysis workflow procedure

## Tools available

The yfinance connection exposes 25+ tools including:
- `get_quote`, `get_profile`, `get_info` — quotes & company info
- `get_historical_data`, `download_data` — historical prices
- `get_income_statement`, `get_balance_sheet`, `get_cashflow` — financials
- `get_recommendations`, `get_price_target` — analyst ratings
- `get_option_chain`, `get_option_expirations` — options
- `search_tickers`, `get_news` — search & news
- `generate_report` — comprehensive HTML report
