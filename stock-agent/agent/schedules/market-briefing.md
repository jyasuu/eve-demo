---
cron: "30 6 * * 1-5"
---

Generate a daily market briefing and send it to the Discord channel:

1. Use `connection__yfinance__get_quote` for SPY and QQQ to check market direction
2. Check futures/pre-market indicators
3. Note key economic events for the day
4. Highlight notable pre-market movers
5. Summarize into a concise briefing with sections: Market Overview, Key Levels, Economic Calendar, Stocks to Watch
6. Call `send_discord_message` with the formatted briefing as the message content to post it to the Discord trading channel
