const fs = require("fs-extra");
const axios = require("axios");
const ytdl = require("ytdl-core");
const { alldown } = require("shaon-videos-downloader");

module.exports = {
  config: {
    name: "play",
    version: "2.0.0",
    author: "MOHAMMAD AKASH",
    role: 0,
    description: "Universal video downloader: TikTok, Instagram, YouTube",
    category: "user",
    usages: "autodl [video link]",
    cooldowns: 5
  },

  onEvent: async function({ api, event }) {
    const content = event.body ? event.body : "";
    if (!content.startsWith("https://")) return;

    try {
      api.setMessageReaction("⚠️", event.messageID, (err) => {}, true);

      let videoUrl;

      // 1️⃣ TikTok Lite short link
      if (content.includes("vm.tiktok.com")) {
        const res = await axios.get(`https://api.tiktok.com/api/shortlink/resolve/?url=${encodeURIComponent(content)}`);
        videoUrl = res.data.video_url;
      } 
      // 2️⃣ YouTube
      else if (content.includes("youtube.com") || content.includes("youtu.be")) {
        videoUrl = await ytdl.getInfo(content).then(info => ytdl.chooseFormat(info.formats, { quality: 'highestvideo' }).url);
      } 
      // 3️⃣ Instagram + TikTok normal
      else {
        const data = await alldown(content);
        videoUrl = data.url;
      }

      if (!videoUrl) return api.sendMessage("❌ | Could not fetch video URL.", event.threadID, event.messageID);

      api.setMessageReaction("☢️", event.messageID, (err) => {}, true);

      // Download video
      const videoData = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;
      const path = __dirname + "/cache/auto.mp4";
      await fs.ensureDir(__dirname + "/cache");
      await fs.writeFile(path, videoData);

      return api.sendMessage({
        body: "🤖 | Auto Downloader Complete! Enjoy your video 🎬",
        attachment: fs.createReadStream(path)
      }, event.threadID, event.messageID);

    } catch (err) {
      console.log("Error:", err);
      return api.sendMessage("❌ | Failed to download video.", event.threadID, event.messageID);
    }
  }
};
