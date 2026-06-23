# eve-demo

Vercel Eve agent for stock market analysis using yfinance-mcp-server + opencode.ai Big Pickle model.

## Structure

```
stock-agent/          # Eve agent project
├── agent/
│   ├── instructions.md        # Agent identity & rules
│   ├── agent.ts               # Model config (opencode.ai big-pickle)
│   ├── channels/eve.ts        # Web channel auth setup
│   ├── connections/
│   │   └── yfinance.ts        # MCP connection to Yahoo Finance
│   └── skills/
│       └── stock-analysis.md  # Deep-dive workflow skill
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js 24.x
- Docker (for yfinance-mcp-server)
- No API key needed — opencode.ai Big Pickle is free

## Quick start

```bash
# Start yfinance MCP server
docker run -d --name yfinance-mcp -p 8080:8080 \
  -e YFINANCE_HTTP_PORT=8080 \
  ghcr.io/jyasuu/yfinance-mcp:latest

# Start the Eve agent (TUI)
cd stock-agent
npx eve dev
```

Or start the production server and query via script:

```bash
# Build and start server
npx eve build
npx eve start --port 3000

# Send a query (from another terminal)
node -e "
import { Client } from 'eve/client';
const c = new Client({ host: 'http://localhost:3000' });
const s = c.session();
const r = await s.send('Analyze AAPL stock');
console.log((await r.result()).message);
"
```

The agent discovers all yfinance tools automatically through the MCP connection. Try queries like:
- *"What's AAPL trading at?"*
- *"Analyze Microsoft stock"*
- *"Get news for NVDA"*

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Eve dev server (TUI) |
| `npm run build` | Build for production |
| `npm run start` | Start built production server |
| `npm run typecheck` | Run TypeScript checks |