const { getTime, drive } = global.utils;
if (!global.temp.kickEvent)
    global.temp.kickEvent = {};

module.exports = {
    config: {
        name: "leave",
        version: "3.0",
        author: "Mehedi Hassan",
        category: "events"
    },

    langs: {
        en: {
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            botLeave: "Seems like I’ve been removed from the group 🥲",
            multiple1: "you",
            multiple2: "you guys",
            defaultLeaveMessage: `
•💔𓂃💔𓂃💔𓂃💔𓂃💔•
   •❥❥❥❥❥♥❥❥❥❥❥•
        ✮•°𝑲𝒊𝒄𝒌𝒆𝒅°•✮•        
 ✫     {userName}       ༂         
• °•✮•°•✮•°•✮•°•✮•°•✮• •
•°•°•°•°•°•°•°•°•°•°•°•°•°•°• •
   ┊   ┊   ┊   ┊   ┊   ┊    ┊
   ┊   ┊   ┊   ┊   ┊   ┊    ┊
   ┊   ┊   ┊  💣  ┊   ┊   💣
   ┊   ┊  💣        ┊  💣    
  💣  ┊              💣           
        💣
{userName} was removed from {boxName} 😢
Have a nice {session}! 🍂`
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        if (event.logMessageType == "log:unsubscribe") {
            const hours = getTime("HH");
            const { threadID } = event;
            const { leftParticipantFbId, adminFbId } = event.logMessageData;

            // যদি বটকে রিমুভ করে
            if (leftParticipantFbId == api.getCurrentUserID())
                return message.send(getLang("botLeave"));

            // যদি কেউ নিজে লিভ দেয়, তাহলে কাজ করবে না
            if (!adminFbId || leftParticipantFbId === adminFbId) return;

            // শুধুমাত্র অ্যাডমিন কিক করলে কাজ করবে
            if (!global.temp.kickEvent[threadID])
                global.temp.kickEvent[threadID] = {
                    kickTimeout: null,
                    kickedParticipants: []
                };

            global.temp.kickEvent[threadID].kickedParticipants.push(leftParticipantFbId);
            clearTimeout(global.temp.kickEvent[threadID].kickTimeout);

            global.temp.kickEvent[threadID].kickTimeout = setTimeout(async function () {
                const threadData = await threadsData.get(threadID);
                if (threadData.settings.sendLeaveMessage == false) return;

                const kicked = global.temp.kickEvent[threadID].kickedParticipants;
                const threadName = threadData.threadName;
                const userName = [], mentions = [];
                let multiple = false;

                if (kicked.length > 1) multiple = true;

                for (const uid of kicked) {
                    try {
                        const info = await api.getUserInfo(uid);
                        const name = info[uid]?.name || "Unknown";
                        userName.push(name);
                        mentions.push({ tag: name, id: uid });
                    } catch {
                        continue;
                    }
                }

                if (userName.length == 0) return;

                let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;
                const form = {
                    mentions: leaveMessage.match(/\{userNameTag\}/g) ? mentions : null
                };

                leaveMessage = leaveMessage
                    .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
                    .replace(/\{boxName\}|\{threadName\}/g, threadName)
                    .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
                    .replace(
                        /\{session\}/g,
                        hours <= 10
                            ? getLang("session1")
                            : hours <= 12
                                ? getLang("session2")
                                : hours <= 18
                                    ? getLang("session3")
                                    : getLang("session4")
                    );

                form.body = leaveMessage;

                if (threadData.data.leaveAttachment) {
                    const files = threadData.data.leaveAttachment;
                    const attachments = files.reduce((acc, file) => {
                        acc.push(drive.getFile(file, "stream"));
                        return acc;
                    }, []);
                    form.attachment = (await Promise.allSettled(attachments))
                        .filter(({ status }) => status == "fulfilled")
                        .map(({ value }) => value);
                }

                message.send(form);
                delete global.temp.kickEvent[threadID];
            }, 1500);
        }
    }
};
