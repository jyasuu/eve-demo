---
name: eve-evals
description: Use when writing, modifying, or running evals for the stock agent in stock-agent/evals/. Covers the defineEval API, matchers, and how to run evals.
---

# Eve Evals

Files: `stock-agent/evals/*.eval.ts`

## Config

`evals/evals.config.ts`:
```ts
import { defineEvalConfig } from "eve/evals";
export default defineEvalConfig({
  judge: { model: "openai/gpt-4o-mini" },
});
```

## Test structure

```ts
import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

export default defineEval({
  description: "What this eval tests.",
  async test(t) {
    await t.send("User message to the agent");
    t.succeeded();              // marks turn complete
    t.calledTool("tool_name");  // asserts tool was called
    t.check(t.reply, includes("expected text"));  // asserts reply content
  },
});
```

## Key APIs

| Method | Purpose |
|---|---|
| `t.send(text)` | Send a message, returns when reply is ready |
| `t.succeeded()` | Mark current turn as completed (was `t.completed()` pre-0.17) |
| `t.calledTool(name)` | Assert a specific tool was called |
| `t.check(value, matcher)` | Assert a value matches (like Jest `expect`) |
| `t.reply` | Agent's last reply text |

## Matchers

Import from `eve/evals/expect`:
- `includes(str)` -- string contains substring
- `matches(regex)` -- string matches regex
- `equals(value)` -- deep equality

## Running

```bash
cd stock-agent
npm run build
npx eve eval
```
