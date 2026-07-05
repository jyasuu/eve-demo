import { discordChannel } from "eve/channels/discord";

export default discordChannel({
  credentials: {
    botToken: process.env.DISCORD_BOT_TOKEN,
    publicKey: process.env.DISCORD_PUBLIC_KEY,
    applicationId: process.env.DISCORD_APPLICATION_ID,
  },
});
