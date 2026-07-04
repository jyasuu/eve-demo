import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Upload an SVG image to a Discord channel using the bot token. Use this to share charts, heatmaps, or any generated SVG visualization with the user.",
  inputSchema: z.object({
    channelId: z.string().describe("Discord channel ID to upload the image to"),
    svgContent: z.string().describe("Raw SVG markup string to upload"),
    filename: z.string().default("chart.svg").describe("Filename for the uploaded SVG (must end in .svg)"),
    caption: z.string().optional().describe("Optional text caption to accompany the image"),
  }),
  async execute({ channelId, svgContent, filename, caption }) {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      return { error: "DISCORD_BOT_TOKEN is not set" };
    }

    const form = new FormData();
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    form.append("file", blob, filename);
    if (caption) {
      form.append("content", caption);
    }

    const url = `https://discord.com/api/v10/channels/${encodeURIComponent(channelId)}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bot ${token}` },
      body: form,
    });

    if (!res.ok) {
      const text = await res.text();
      return { error: `Discord upload error ${res.status}: ${text}` };
    }

    const msg = await res.json();
    const attachment = msg.attachments?.[0];

    return {
      ok: true,
      messageId: msg.id,
      imageUrl: attachment?.url ?? null,
      filename: attachment?.filename ?? filename,
    };
  },
});
