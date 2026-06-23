import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { defineAgent } from "eve";

const opencode = createOpenAICompatible({
  name: "opencode",
  baseURL: "https://opencode.ai/zen/v1",
});

export default defineAgent({
  model: opencode("big-pickle"),
  modelContextWindowTokens: 200000,
});
