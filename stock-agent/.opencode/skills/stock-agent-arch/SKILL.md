---
name: stock-agent-arch
description: Use when working on the stock-analysis Eve agent in stock-agent/. Covers the agent's architecture, key files, and the relationship between agent.ts, instructions.md, connections, tools, subagents, skills, schedules, hooks, sandbox, and instrumentation.
---

# Stock Agent Architecture

The agent lives at `stock-agent/agent/` and follows the standard Eve agent layout.

## Key files

| File | Purpose |
|---|---|
| `agent/agent.ts` | Model config -- uses `@ai-sdk/openai-compatible` -> `opencode.ai/zen/v1` model `big-pickle` with 200K context window |
| `agent/instructions.md` | System prompt -- stock market analyst persona, guidelines to use `connection__yfinance__*` tools |
| `agent/connections/yfinance.ts` | MCP client connection to yfinance-mcp-server at `http://localhost:8080/mcp` |
| `agent/tools/portfolio_heatmap.ts` | Custom tool with durable state via `defineState` from `eve/context` |
| `agent/subagents/technical_analyst/` | Delegated subagent for chart pattern analysis |
| `agent/skills/*.md` | Loadable skill workflows (stock-analysis, earnings-analysis, options-analysis) |
| `agent/schedules/market-briefing.md` | Cron: `30 6 * * 1-5` daily market briefing |
| `agent/channels/slack.ts` | Slack channel via Vercel Connect |
| `agent/hooks/audit.ts` | Logs portfolio_heatmap tool calls |
| `agent/sandbox/sandbox.ts` | Python sandbox with numpy/scipy |
| `agent/instrumentation.ts` | Records all inputs and outputs |

## Tool naming

yfinance MCP tools are prefixed `connection__yfinance__` automatically by Eve (e.g., `connection__yfinance__get_quote`). When writing instructions or skills, always use the full prefixed name.

## Build & dev

```bash
cd stock-agent
npm run typecheck   # tsc
npm run build       # eve build -> .output/
npm run dev         # eve dev -> TUI at localhost:2000
```

## Tests

```bash
cd stock-agent
npx eve eval        # runs evals/*.eval.ts
```
