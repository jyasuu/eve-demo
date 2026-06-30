---
name: yfinance-mcp
description: Use when working with the yfinance MCP connection in stock-agent/. Covers the available Yahoo Finance tools, their signatures, and how to use them via the connection__yfinance__ prefix.
---

# yfinance MCP Tools

The stock agent connects to yfinance-mcp-server via MCP at `agent/connections/yfinance.ts`. All tools are prefixed `connection__yfinance__`.

## Setup

Requires Docker:
```bash
docker run -p 8080:8080 ghcr.io/jackstenglein/yfinance-mcp-server:latest
```

Connection config (`agent/connections/yfinance.ts`):
```ts
export default defineMcpClientConnection({
  url: "http://localhost:8080/mcp",
  description: "Yahoo Finance stock market data: quotes, financials, historical data, earnings, recommendations, options, news, and company profiles.",
});
```

## Available tools

### Quotes & Company Info
- `connection__yfinance__get_quote(symbols: string[])` -- Current price, change, volume
- `connection__yfinance__get_profile(symbol: string)` -- Sector, industry, description
- `connection__yfinance__get_info(symbol: string)` -- Market cap, PE ratio, dividend yield

### Historical Data
- `connection__yfinance__get_historical_data(symbol, interval, range)` -- OHLCV data. Intervals: `1m`, `2m`, `5m`, `15m`, `30m`, `60m`, `1d`, `1wk`, `1mo`. Ranges: `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `2y`, `5y`, `10y`, `ytd`, `max`
- `connection__yfinance__download_data(symbols[], interval, period)` -- Multi-symbol download

### Financials
- `connection__yfinance__get_income_statement(symbol)` -- Revenue, operating income, net income
- `connection__yfinance__get_balance_sheet(symbol)` -- Assets, liabilities, equity
- `connection__yfinance__get_cashflow(symbol)` -- Operating, investing, financing cash flows
- `connection__yfinance__get_key_statistics(symbol)` -- Key metrics summary

### Analyst & Market Data
- `connection__yfinance__get_recommendations(symbol)` -- Analyst ratings history
- `connection__yfinance__get_price_target(symbol)` -- Price targets (high/mean/low)
- `connection__yfinance__get_earnings(symbol)` -- Quarterly earnings history
- `connection__yfinance__get_earnings_trend(symbol)` -- Analyst estimates trend
- `connection__yfinance__get_calendar(symbol)` -- Upcoming events, earnings date

### Options
- `connection__yfinance__get_option_expirations(symbol)` -- Available expiration dates
- `connection__yfinance__get_option_chain(symbol, expiration)` -- Calls/puts with strike, OI, IV

### Search & News
- `connection__yfinance__search_tickers(query)` -- Search for tickers by company name
- `connection__yfinance__get_news(symbol)` -- Recent news articles

### Reports
- `connection__yfinance__generate_report(symbol)` -- Comprehensive HTML report
