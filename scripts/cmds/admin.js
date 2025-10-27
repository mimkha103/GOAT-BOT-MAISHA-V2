/cmd install owner.js const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "admin",
    version: "1.0.1",
    author: "MOHAMMAD AKASH",
    countDown: 2,
    role: 0,
    shortDescription: "Owner এর তথ্য দেখায়",
    longDescription: "Bot এর Owner সম্পর্কে বিস্তারিত তথ্য ও কন্টাক্ট লিংক দেখায়",
    category: "info",
  },

  onStart: async function ({ api, event }) {
    const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

    const callback = () =>
      api.sendMessage(
        {
          body: `
╭────────────────⭓
│ 👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢  
├────────────────
│ 👤 𝐍𝐚𝐦𝐞 : 𝗠𝗲𝗵𝗲𝗱𝗶 𝗛𝗮𝘀𝗮𝗻  
│ 🚹 𝐆𝐞𝐧𝐝𝐞𝐫 : 𝐌𝐚𝐥𝐞  
│ ❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 : 𝐒𝐢𝐧𝐠𝐥𝐞  
│ 🎂 𝐀𝐠𝐞 : 𝟐𝟐+  
│ 🎓 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : 𝗜𝗻𝘁𝗲𝗿 2𝗻𝗱 𝗬𝗲𝗮𝗿  
│ 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : 𝗗𝗵𝗮𝗸𝗮 - 𝗚𝗮𝘇𝗶𝗽𝘂𝗿  
╰────────────────⭓

╭────────────────⭓
│ 🌐 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞  
├────────────────
│ 📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸:
│ https://www.facebook.com/profile.php?id=100003016757604   
╰────────────────⭓

╭────────────────⭓
│ 🕒 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗧𝗶𝗺𝗲  
├────────────────
│ ${time}  
╰────────────────⭓
`,
          attachment: fs.createReadStream(__dirname + "/cache/owner.jpg"),
        },
        event.threadID,
        () => fs.unlinkSync(__dirname + "/cache/owner.jpg")
      );

    request("https://i.imgur.com/eb4x3cK.jpeg")
      .pipe(fs.createWriteStream(__dirname + "/cache/owner.jpg"))
      .on("close", () => callback());
  },
};
