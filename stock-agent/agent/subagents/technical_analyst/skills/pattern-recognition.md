Use when the user asks about chart patterns, technical formations, or price action analysis.

## Common Patterns to Identify

1. **Trend patterns**: Higher highs/lows (uptrend), lower highs/lows (downtrend), consolidation (range-bound)
2. **Reversal patterns**: Head and shoulders, double top/bottom, rounding bottom
3. **Continuation patterns**: Flags, pennants, wedges, triangles (ascending, descending, symmetrical)
4. **Candlestick patterns**: Doji, hammer, engulfing, morning/evening star

## Workflow

1. `connection__yfinance__get_historical_data` with range="1mo" and interval="1d" for recent action
2. `connection__yfinance__get_historical_data` with range="1y" and interval="1wk" for medium-term view
3. Compare current price to moving average levels
4. Identify any clear patterns
5. Present with a text-based sketch if helpful