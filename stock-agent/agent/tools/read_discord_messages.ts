import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Read recent messages from a Discord channel using the bot token. Use this to recall what was discussed earlier in the channel.",
  inputSchema: z.object({
    channelId: z.string().describe("Discord channel ID to read messages from"),
    limit: z.number().min(1).max(100).default(20).describe("Number of recent messages to fetch (max 100)"),
  }),
  async execute({ channelId, limit }) {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      return { error: "DISCORD_BOT_TOKEN is not set" };
    }

    const url = `https://discord.com/api/v10/channels/${encodeURIComponent(channelId)}/messages?limit=${limit}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bot ${token}` },
    });

    if (!res.ok) {
      const text = await res.text();
      return { error: `Discord API error ${res.status}: ${text}` };
    }

    const messages: any[] = await res.json();
    const formatted = messages.reverse().map((m) => ({
      author: m.author?.global_name ?? m.author?.username ?? "unknown",
      timestamp: m.timestamp,
      content: m.content,
      attachments: m.attachments?.map((a: any) => a.url) ?? [],
    }));

    return {
      channelId,
      count: formatted.length,
      messages: formatted,
    };
  },
});
