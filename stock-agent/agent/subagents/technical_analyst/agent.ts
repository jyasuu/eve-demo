import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { defineAgent } from "eve";

const opencode = createOpenAICompatible({
  name: "opencode",
  baseURL: "https://opencode.ai/zen/v1",
});

export default defineAgent({
  description: "Technical analysis specialist: chart patterns, support/resistance, moving averages, RSI, MACD, and trend analysis for stock trading decisions.",
  model: opencode("big-pickle"),
  modelContextWindowTokens: 200000,
});
