import { defineSchedule } from "eve/schedules";
import discord from "../channels/discord.js";

export default defineSchedule({
  cron: "0 0 * * *",
  async run({ receive, waitUntil, appAuth }) {
    waitUntil(
      receive(discord, {
        message: "Hello from eve! This is a proactive test message.",
        target: { channelId: "987513367369515011" },
        auth: appAuth,
      })
    );
  },
});
