import { defineTool } from "eve/tools";
import { z } from "zod";
import sharp from "sharp";

export default defineTool({
  description: "Upload an SVG chart as a PNG image to a Discord channel. Use this to share charts, heatmaps, or any generated visualization with the user.",
  inputSchema: z.object({
    channelId: z.string().describe("Discord channel ID to upload the image to"),
    svgContent: z.string().describe("Raw SVG markup string to render and upload"),
    caption: z.string().optional().describe("Optional text caption to accompany the image"),
  }),
  async execute({ channelId, svgContent, caption }) {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      return { error: "DISCORD_BOT_TOKEN is not set" };
    }

    const pngBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer();

    const form = new FormData();
    form.append("file", new Blob([pngBuffer], { type: "image/png" }), "chart.png");
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
    };
  },
});
