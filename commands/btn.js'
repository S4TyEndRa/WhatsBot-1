const axios = require('axios');
const FormData = require('form-data');
let mime = require('mime-to-extensions');
const {MessageMedia} = require('whatsapp-web.js');

const execute = async (client,msg) => {
    msg.delete(true);
    if (msg.body.startsWith("!testb") && msg.hasQuotedMsg) { // getting message from quote when user do a !test command

        var quotedMsg = await msg.getQuotedMessage()
        var quotedmessagetext = quotedMsg.body
        client.sendMessage(msg.to, "test") // send a message
            
        quotedMsg.reply("test") // Quoted msg reply
        let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
        msg.reply(button) // Client's msg reply
        }
    else if (msg.body === '!buttons') {
        let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
        client.sendMessage(msg.from, button);
    } else if (msg.body === '!list') {
        let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
        let list = new List('List body','btnText',sections,'Title','footer');
        client.sendMessage(msg.from, list);
    }};
module.exports = {
    name: 'button',
    description: 'responds with btn',
    command: '!btn',
    commandType: 'info',
    isDependent: false,
    help: undefined,
    execute};
