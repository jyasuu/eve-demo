import { defineHook } from "eve/hooks";

export default defineHook({
  events: {
    "action.result"(event) {
      const toolName = event.data.result?.toolName;
      if (toolName === "portfolio_heatmap") {
        console.log("[audit] portfolio_heatmap called");
      }
    },
  },
});
