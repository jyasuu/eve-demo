import { defineTool } from "eve/tools";
import { z } from "zod";
import { renderAsync } from "@resvg/resvg-js";

export default defineTool({
  description: "Generate a chart from data using Python (matplotlib) and upload it as a PNG image to a Discord channel. Use this for any data visualization.",
  inputSchema: z.object({
    channelId: z.string().describe("Discord channel ID to upload the chart to"),
    chartType: z.enum(["line", "bar", "area", "scatter"]).default("line").describe("Type of chart to generate"),
    title: z.string().default("Chart").describe("Chart title"),
    xLabel: z.string().default("").describe("X-axis label"),
    yLabel: z.string().default("").describe("Y-axis label"),
    labels: z.array(z.string()).describe("Labels for the x-axis (e.g. dates, categories)"),
    datasets: z.array(z.object({
      label: z.string().describe("Dataset label for legend"),
      values: z.array(z.number()).describe("Data values"),
      color: z.string().optional().describe("Line/bar color (hex, e.g. #00b894)"),
    })).min(1).describe("One or more datasets to plot"),
    caption: z.string().optional().describe("Optional text caption for the Discord message"),
  }),
  async execute({ channelId, chartType, title, xLabel, yLabel, labels, datasets, caption }, ctx) {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      return { error: "DISCORD_BOT_TOKEN is not set" };
    }

    const colors = ["#00b894", "#0984e3", "#e17055", "#fdcb6e", "#a29bfe", "#fd79a8", "#00cec9", "#636e72"];
    const pyDatasets = JSON.stringify(datasets.map((d, i) => ({
      label: d.label,
      values: d.values,
      color: d.color ?? colors[i % colors.length],
    })));

    const pyScript = `
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import json, sys, numpy as np

datasets = json.loads("""${pyDatasets}""")
labels = ${JSON.stringify(labels)}
title = ${JSON.stringify(title)}
xlabel = ${JSON.stringify(xLabel)}
ylabel = ${JSON.stringify(yLabel)}
chart_type = ${JSON.stringify(chartType)}

fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor("#1a1a2e")
ax.set_facecolor("#16213e")

x = np.arange(len(labels))
ax.set_xticks(x)
ax.set_xticklabels(labels, rotation=45, ha="right", fontsize=9, color="#b2bec3")
ax.tick_params(colors="#b2bec3", which="both")
for spine in ax.spines.values():
    spine.set_color("#636e72")

ax.set_title(title, color="#dfe6e9", fontsize=14, fontweight="bold", pad=15)
ax.set_xlabel(xlabel, color="#b2bec3", fontsize=11)
ax.set_ylabel(ylabel, color="#b2bec3", fontsize=11)

ax.grid(True, alpha=0.15, color="#636e72")

for d in datasets:
    if chart_type == "bar":
        ax.bar(x, d["values"], label=d["label"], color=d["color"], alpha=0.85, width=0.6)
    elif chart_type == "area":
        ax.fill_between(x, d["values"], alpha=0.25, color=d["color"])
        ax.plot(x, d["values"], color=d["color"], linewidth=2, label=d["label"])
    elif chart_type == "scatter":
        ax.scatter(x, d["values"], label=d["label"], color=d["color"], s=50, zorder=5)
    else:
        ax.plot(x, d["values"], color=d["color"], linewidth=2, marker="o", markersize=4, label=d["label"])

ax.legend(facecolor="#2d3436", edgecolor="#636e72", labelcolor="#dfe6e9", fontsize=10)

plt.tight_layout()
plt.savefig("/workspace/chart.svg", format="svg", dpi=150, bbox_inches="tight")
print("CHART_GENERATED")
`.trim();

    const sandbox = await ctx.getSandbox();
    await sandbox.writeTextFile({ path: "generate_chart.py", content: pyScript });
    const result = await sandbox.run({ command: "python generate_chart.py" });

    if (!result.stdout.includes("CHART_GENERATED")) {
      return { error: `Chart generation failed.\nstdout: ${result.stdout}\nstderr: ${result.stderr}` };
    }

    const svgContent = await sandbox.readTextFile({ path: "chart.svg" });
    if (!svgContent) {
      return { error: "Chart SVG file was not generated" };
    }

    const vbMatch = svgContent.match(/viewBox=["']\s*\d+\s+\d+\s+(\d+)\s+(\d+)\s*["']/);
    const w = vbMatch ? parseInt(vbMatch[1]) : 1200;
    const h = vbMatch ? parseInt(vbMatch[2]) : 600;

    const resvgResult = await renderAsync(svgContent, {
      fitTo: { mode: "width", value: w },
      background: "rgba(0, 0, 0, 0)",
    });
    const pngBuffer = resvgResult.asPng();

    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(pngBuffer)], { type: "image/png" }), "chart.png");
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
      stdout: result.stdout,
    };
  },
});
