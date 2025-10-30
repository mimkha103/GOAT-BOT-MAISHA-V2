module.exports = {
  config: {
    name: "age",
    aliases: ["birthday", "dob"],
    version: "5.0",
    author: "MOHAMMAD AKASH",
    countDown: 5,
    role: 0,
    shortDescription: "Smart Age Calculator",
    longDescription: "Detects DD/MM/YYYY, YYYY, DD-MM-YY or DD/Month/YYYY automatically and calculates your age.",
    category: "utility",
    guide: "{prefix}age 01/01/2000\n{prefix}age 2000\n{prefix}age 10/March/2007",
    botPermissions: ["SEND_MESSAGES", "ATTACH_FILES"],
    dependencies: {
      "axios": "",
      "fs-extra": "",
      "moment-timezone": ""
    }
  },

  onStart: async function ({ api, event, args }) {
    const fs = require("fs-extra");
    const moment = require("moment-timezone");
    const axios = require("axios");

    try {
      if (!args[0]) {
        return api.sendMessage(
          "⚠️ Please provide your birth date or year.\nExample:\n• age 01/01/2009\n• age 2009\n• age 10/March/2007",
          event.threadID
        );
      }

      let input = args.join(" ").trim().replace(/[-]/g, "/"); // - কে / এ রূপান্তর
      let day, month, year;

      // শুধু বছর দেওয়া হলে
      if (/^\d{4}$/.test(input)) {
        year = parseInt(input);
        month = 1;
        day = 1;
      }
      // DD/MM/YYYY বা DD/MM/YY
      else if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(input)) {
        const parts = input.split("/");
        day = parseInt(parts[0]);
        month = parseInt(parts[1]);
        year = parseInt(parts[2]);
        if (year < 100) year += 2000;
      }
      // DD/MonthName/YYYY
      else if (/^\d{1,2}\/[a-zA-Z]+\/\d{4}$/.test(input)) {
        const parts = input.split("/");
        day = parseInt(parts[0]);
        const monthName = parts[1].toLowerCase();
        const monthMap = {
          january: 1, february: 2, march: 3, april: 4,
          may: 5, june: 6, july: 7, august: 8,
          september: 9, october: 10, november: 11, december: 12
        };
        month = monthMap[monthName];
        if (!month) return api.sendMessage("❌ Invalid month name.", event.threadID);
        year = parseInt(parts[2]);
      }
      else {
        return api.sendMessage("❌ Invalid date format.\nUse DD/MM/YYYY, DD/Month/YYYY or just YYYY", event.threadID);
      }

      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return api.sendMessage("❌ Invalid numbers in date.", event.threadID);
      }

      if (year > new Date().getFullYear()) {
        return api.sendMessage("❌ You can’t be born in the future 😅", event.threadID);
      }

      const birthDate = moment.tz(`${year}-${month}-${day}`, "YYYY-MM-DD", "Asia/Dhaka");
      const now = moment.tz("Asia/Dhaka");
      const duration = moment.duration(now.diff(birthDate));

      const years = duration.years();
      const months = duration.months();
      const days = duration.days();
      const totalMonths = years * 12 + months;
      const totalDays = Math.floor(duration.asDays());
      const totalHours = Math.floor(duration.asHours());

      const avatarPath = `${__dirname}/cache/${event.senderID}.jpg`;
      const avatarUrl = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const response = await axios.get(avatarUrl, { responseType: "stream" });
      const writer = fs.createWriteStream(avatarPath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      const message = {
        body: `╔════════════════╗
🎂 𝐒𝐌𝐀𝐑𝐓 𝐀𝐆𝐄 𝐂𝐀𝐋𝐂𝐔𝐋𝐀𝐓𝐎𝐑 🎂
╚════════════════╝

📅 𝐁𝐢𝐫𝐭𝐡 𝐃𝐚𝐭𝐞: ${day}/${month}/${year}
🕒 𝐀𝐠𝐞: ${years} 𝐘𝐞𝐚𝐫𝐬 ${months} 𝐌𝐨𝐧𝐭𝐡𝐬 ${days} 𝐃𝐚𝐲𝐬

══════════════════
📌 𝐃𝐞𝐭𝐚𝐢𝐥𝐬:
➥ ${totalMonths} 𝐌𝐨𝐧𝐭𝐡𝐬
➥ ${totalDays} 𝐃𝐚𝐲𝐬
➥ ${totalHours} 𝐇𝐨𝐮𝐫𝐬
══════════════════

👑 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲: Mehedi Hassan`,
        attachment: fs.createReadStream(avatarPath)
      };

      await api.sendMessage(message, event.threadID);
      fs.unlinkSync(avatarPath);

    } catch (error) {
      console.error("Error in age command:", error);
      api.sendMessage("❌ Error occurred while processing your request.", event.threadID);
    }
  }
};
