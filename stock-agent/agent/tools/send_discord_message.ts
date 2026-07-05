import { defineTool } from "eve/tools";
import { z } from "zod";

const DEFAULT_CHANNEL_ID = "987513367369515011";

export default defineTool({
  description:
    "Post a text message to the configured Discord channel. Use this to send market briefings, reports, or any summary directly to the Discord channel where users interact with the bot.",
  inputSchema: z.object({
    message: z.string().min(1).max(2000).describe("The message content to send (max 2000 characters)"),
    channelId: z.string().optional().describe("Discord channel ID (defaults to the main trading channel)"),
  }),
  async execute({ message, channelId }) {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      return { error: "DISCORD_BOT_TOKEN is not set" };
    }

    const id = channelId ?? DEFAULT_CHANNEL_ID;
    const url = `https://discord.com/api/v10/channels/${encodeURIComponent(id)}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: message }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { error: `Discord API error ${res.status}: ${text}` };
    }

    const msg = await res.json();
    return {
      ok: true,
      messageId: msg.id,
      channelId: id,
    };
  },
});
