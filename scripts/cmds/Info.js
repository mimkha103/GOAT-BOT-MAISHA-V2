module.exports = {
  config: {
    name: "info",
    aliases: ["owner", "botinfo", "admin"],
    version: "6.9.0",
    author: "Mehedi Hassan",
    countDown: 0,
    role: 0,
    description: "Show Cat Bot owner and system info 🌺",
    category: "info",
    guide: {
      en: "{pn} — Show bot information and owner details."
    }
  },

  onStart: async function ({ api, event, global, client }) {
    // Safe command count
    const commandCount =
      (global?.GoatBot?.commands?.size ||
       client?.commands?.size ||
       142);

    // Bot uptime calculation
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const message = `
╭──────────────╮
│   𝐂𝐀𝐓 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 🌺   │
╰──────────────╯
🤖 Name: 𝐂𝐀𝐓 𝐁𝐎𝐓
📜 Version: 2
👑 Owner: ♛Mehedi Hassan♛
🖥️ Creation Date : 10/1/2025
🗺️ Address : Ghazipur,Bangladesh
🔌 Made in : Bangladesh 🇧🇩
💬 Prefix : /
💾 Commands Loaded: ${commandCount}
🕒 Uptime: ${hours}h ${minutes}m ${seconds}s
───────────────────
🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤:61581500445402
💳 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤:61581500445402
───────────────────
24/7 𝐁𝐨𝐭         
• °•✮•°•✮•°•✮•°•✮•°•✮• •
•°•°•°•°•°•°•°•°•°•°•°•°•°•°• •
   ┊   ┊   ┊   ┊   ┊   ┊    ┊
   ┊   ┊   ┊   ┊   ┊   ┊    ┊
   ┊   ┊   ┊  ❣️  ┊   ┊   ❣️
   ┊   ┊  ❣️        ┊  ❣️    
  ❣️  ┊              ❣️           
        ❣️
───────────────────
💖 Thanks for using me 💖
   I'm Always Free 😀
`;

    api.sendMessage(message, event.threadID, event.messageID);
  }
};
