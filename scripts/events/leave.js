const { drive } = global.utils;

module.exports = {
  config: {
    name: "leave",
    version: "3.1",
    author: "MOHAMMAD AKASH",
    category: "events"
  },

  onStart: async ({ threadsData, message, event, api, usersData }) => {
    if (!["log:remove", "log:ban"].includes(event.logMessageType)) return;

    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    if (threadData.settings.sendKickMessage === false) return;

    const log = event.logMessageData || {};

    // voluntary leave হলে ইগনোর
    if (log.leftParticipantFbId && !log.removedParticipantFbId) return;

    const kickedId = log.removedParticipantFbId || log.kickedParticipantFbId || log.bannedParticipantFbId || null;
    if (!kickedId || kickedId == api.getCurrentUserID()) return;

    const kickerId = log.removedBy || log.kickerId || log.kickedBy || event.author || null;
    if (!kickerId || kickerId === kickedId) return;

    const threadName = threadData.threadName || "this group";
    const userName = await usersData.getName(kickedId);
    const kickerName = await usersData.getName(kickerId);

    const kickMessage = `
•💔𓂃💔𓂃💔𓂃💔𓂃💔•
   •❥❥❥❥❥♥❥❥❥❥❥•
        ✮•°𝑲𝒊𝒄𝒌𝒆𝒅°•✮•        
 ✫     ${userName}       ༂         
• °•✮•°•✮•°•✮•°•✮•°•✮• •
${userName} was removed from 💬 ${threadName} 😢
Kicked by: ${kickerName}
Have a nice afternoon! 🍂`;

    const mentions = [
      { tag: userName, id: kickedId },
      { tag: kickerName, id: kickerId }
    ];

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
