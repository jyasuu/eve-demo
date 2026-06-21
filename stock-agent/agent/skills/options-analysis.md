Use when the user asks about options chains, option strategies, or derivatives analysis.

## Workflow

1. `connection__yfinance__get_option_expirations` to find available expiration dates
2. `connection__yfinance__get_option_chain` for a specific expiration
3. Analyze open interest, implied volatility, and put/call ratio

## Key Metrics

- **Open Interest**: Total outstanding contracts
- **Implied Volatility**: Market's expected future volatility
- **Put/Call Ratio**: Sentiment indicator (high = bearish, low = bullish)
- **Strike Clusters**: Where the most open interest is concentrated
- **Max Pain**: The strike price where option buyers lose the most money

## Guidelines

- Use the nearest monthly expiration unless specified otherwise
- Compare current IV to historical IV when possible
- Note any abnormal volume or OI concentrations