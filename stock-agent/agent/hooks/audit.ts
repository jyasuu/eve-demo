import { defineHook } from "eve/hooks";

export default defineHook({
  events: {
    "action.result"(event) {
      const result = event.data.result;
      if (result?.kind === "tool-result" && result.toolName === "portfolio_heatmap") {
        console.log("[audit] portfolio_heatmap called");
      }
    },
  },
});
