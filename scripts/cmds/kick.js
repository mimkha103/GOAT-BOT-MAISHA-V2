const { drive } = global.utils;

module.exports = {
  config: {
    name: "kick",
    version: "3.0",
    author: "MOHAMMAD AKASH",
    category: "events"
  },

  onStart: async ({ threadsData, message, event, api, usersData }) => {
    // শুধুমাত্র unsubscribe লোগ ইনভেন্ট নিয়ে কাজ
    if (event.logMessageType !== "log:unsubscribe") return;
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    if (!threadData.settings.sendKickMessage) return;

    const log = event.logMessageData || {};

    // voluntary leave হলে থাকা ফিল্ড: leftParticipantFbId
    // আমরা voluntary leave হলে কিছুই করব না
    if (log.leftParticipantFbId) return;

    // কিক/রিমুভ হওয়া ব্যক্তির সম্ভাব্য ফিল্ডগুলো
    const kickedId =
      log.removedParticipantFbId ||
      log.kickedParticipantFbId ||
      log.bannedParticipantFbId ||
      null;

    // কিক করেছে এমন ব্যক্তির সম্ভাব্য ফিল্ডগুলো
    const kickerId =
      log.removedBy ||
      log.kickerId ||
      log.kickedBy ||
      event.author ||
      null;

    // সঠিকভাবে কিক শনাক্ত করা না গেলে বাতিল
    if (!kickedId) return;
    // বটকে কিক করলে ইগনোর
    if (kickedId == api.getCurrentUserID()) return;
    // kicker না থাকলে বা kicker === kicked -> voluntary/অস্পষ্ট, তাই ইগনোর
    if (!kickerId || kickerId === kickedId) return;

    // ইউজার ও থ্রেড ইনফ
    const threadName = threadData.threadName || "this group";
    const userName = await usersData.getName(kickedId);
    const kickerName = await usersData.getName(kickerId);

    // আপনার কাস্টম ASCII/emoji টেমপ্লেট (আপনার দেওয়া স্টাইল)
    const kickMessage = `
•💔𓂃💔𓂃💔𓂃💔𓂃💔•
   •❥❥❥❥❥♥❥❥❥❥❥•
        ✮•°𝑲𝒊𝒄𝒌𝒆𝒅°•✮•        
 ✫     ${userName}       ༂         
• °•✮•°•✮•°•✮•°•✮•°•✮• •
•°•°•°•°•°•°•°•°•°•°•°•°•°•°• •
   ┊   ┊   ┊   ┊   ┊   ┊    ┊
   ┊   ┊   ┊   ┊   ┊   ┊    ┊
   ┊   ┊   ┊  💣  ┊   ┊   💣
   ┊   ┊  💣        ┊  💣    
  💣  ┊              💣           
        💣
${userName} was removed from 💬 ${threadName} 😢
Kicked by: ${kickerName}
Have a nice afternoon! 🍂`;

    // মেনশন দুজনকেই
    const mentions = [
      { tag: userName, id: kickedId },
      { tag: kickerName, id: kickerId }
    ];

    // যদি থ্রেডে kickAttachment থাকে, সেটাও পাঠাবে
    const form = { body: kickMessage, mentions };
    if (threadData.data && threadData.data.kickAttachment) {
      const files = threadData.data.kickAttachment;
      const attachments = files.map(file => drive.getFile(file, "stream"));
      form.attachment = (await Promise.allSettled(attachments))
        .filter(r => r.status === "fulfilled")
        .map(r => r.value);
    }

    message.send(form);
  }
};
