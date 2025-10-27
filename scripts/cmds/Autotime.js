const moment = require("moment-timezone");
const axios = require("axios");

module.exports.config = {
  name: "autotimer",
  version: "4.0",
  role: 0,
  author: "MOHAMMAD AKASH (Design by Mehedi Hasan)",
  description: "⏰ প্রতি ঘণ্টায় সব গ্রুপে ইসলামী রিমাইন্ডারসহ সুন্দর বার্তা পাঠাবে",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {
  // 🔄 বট লোড হওয়ার পর ৫ সেকেন্ড পর থেকে চেক শুরু হবে
  setTimeout(async () => {
    const timerData = {
      "12:00:00 AM": "🌙 মধ্যরাত! ঘুমাও, কালকের দিন নতুন আশায় শুরু করো 😴",
      "01:00:00 AM": "🌌 রাত গভীর! একটু বিশ্রাম নাও 💤",
      "02:00:00 AM": "🌠 এখনো জেগে আছো? চোখটা বন্ধ করো 😪",
      "03:00:00 AM": "🌃 রাত প্রায় শেষ, ঘুমাও বন্ধু 😴",
      "04:00:00 AM": "🌄 ভোর হতে যাচ্ছে, নতুন আলো আসছে 🌤️",
      "05:00:00 AM": "🌅 শুভ সকাল! হাসিমুখে দিন শুরু করো ☀️",
      "06:00:00 AM": "🌞 সকাল বেলা! এক কাপ চা কফি কেমন হবে ☕",
      "07:00:00 AM": "🍞 নাস্তার সময়! শরীর ভালো রাখো 💪",
      "08:00:00 AM": "🌤️ নতুন দিনের ব্যস্ততা শুরু! সফল হও ✨",
      "09:00:00 AM": "🕘 শুভ সকাল! কাজে মন দাও 💼",
      "10:00:00 AM": "🌞 সকালের সূর্য তোমার জন্য শক্তি আনুক ☀️",
      "11:00:00 AM": "🌻 সকাল শেষ! একটু বিশ্রাম নাও 😌",
      "12:00:00 PM": "🍛 দুপুরের খাবার সময়! খেয়ে নাও 😋",
      "01:00:00 PM": "😴 একটু বিশ্রাম নাও, দুপুরের ঘুম ভালো জিনিস 💤",
      "02:00:00 PM": "🌤️ বিকেল আসছে! মন ভালো রাখো ☀️",
      "03:00:00 PM": "☀️ বিকেলের রোদে হাসি ছড়াও 💛",
      "04:00:00 PM": "🌇 বিকেল শেষ! একটু শান্তি নাও ☕",
      "05:00:00 PM": "🌆 সন্ধ্যা নামছে! দিনটা কেমন কাটলো? 😊",
      "06:00:00 PM": "🌇 শুভ সন্ধ্যা! একটু সময় নিজের জন্য রাখো ✨",
      "07:00:00 PM": "🌃 রাত নামছে, মনটা শান্ত করো 💫",
      "08:00:00 PM": "🍽️ রাতের খাবার সময় 😋",
      "09:00:00 PM": "🌙 রাত গভীর হচ্ছে! বিশ্রাম নাও 🛌",
      "10:00:00 PM": "😴 শুভ রাত্রি! মিষ্টি ঘুমে চোখ বুজে ফেলো 🌠",
      "11:00:00 PM": "🌌 দিন শেষ! ঘুমানোর প্রস্তুতি নাও 💤"
    };

    console.log("✅ AutoTimer System Started — প্রতি ঘণ্টায় সময় চেক হচ্ছে...");

    const checkTimeAndSend = async () => {
      const now = moment().tz("Asia/Dhaka").format("hh:mm:ss A");
      const messageText = timerData[now];
      if (!messageText) return;

      const timeFormatted = moment().tz("Asia/Dhaka").format("hh:mm A");
      const todayEnglish = moment().tz("Asia/Dhaka").format("DD/MM/YYYY, dddd");

      // বাংলা দিন-তারিখ হিসাব করা
      const monthsBn = [
        "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
        "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
      ];
      const daysBn = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
      const nowDate = new Date();
      const banglaDay = daysBn[nowDate.getDay()];
      const banglaMonth = monthsBn[nowDate.getMonth()];
      const banglaDate = nowDate.getDate() + 7; // আনুমানিক ক্যালেন্ডার সমন্বয়
      const banglaYear = 1432;

      const finalMessage = 
`╔═❖═❖═❖═❖═❖═❖═╗
 ⏰ 𝗧𝗜𝗠𝗘 & 𝗗𝗔𝗧𝗘 ⏰
╚═❖═❖═❖═❖═❖═❖═╝
    ╔═✪═🕒═✪═╗
    সময়: ${timeFormatted}
    ╚════════╝
📅 ইংরেজি তারিখ: ${todayEnglish}
🗓️ বাংলা তারিখ: ${banglaDate} ${banglaMonth}, ${banglaYear} (${banglaDay})
🌍 টাইমজোন: Asia/Dhaka
━━━━━━━━━━━━━━━━━━━━
${messageText}
✨ আল্লাহর নিকটে বেশি বেশি দোয়া করুন..! 
🙏 ৫ ওয়াক্ত নামাজ নিয়মিত পড়ুন..! 
🤝 সকলের সাথে সদ্ভাব বজায় রাখুন..! 
━━━━━━━━━━━━━━━━━━━━
🌸✨🌙🕊️🌼🌿🕌💖🌙🌸✨🌺

🌟 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 🌟`;

      try {
        const allThreads = await api.getThreadList(100, null, ["INBOX"]);
        const groupThreads = allThreads.filter(t => t.isGroup);

        console.log(`🕒 ${now} → ${groupThreads.length} গ্রুপে মেসেজ পাঠানো হচ্ছে...`);
        for (const thread of groupThreads) {
          await api.sendMessage(finalMessage, thread.threadID);
        }
        console.log("✅ সফলভাবে সব গ্রুপে বার্তা পাঠানো হয়েছে!");
      } catch (err) {
        console.error("❌ AutoTimer Error:", err);
      }
    };

    // ⏱️ প্রতি ১ সেকেন্ডে সময় চেক
    setInterval(checkTimeAndSend, 1000);
  }, 5000);
};

module.exports.onStart = () => {};
