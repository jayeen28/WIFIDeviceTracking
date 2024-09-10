require('dotenv').config();
const dgram = require('dgram');
const replaceMacWithName = require('./lib/replaceMacWithName');
const server = dgram.createSocket('udp4');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TG_BOT_TOKEN, { polling: true });
const users = process.env.ALLOWED_TG_USERS.split(',').map(Number);

server.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (log = new Buffer("")) => {
    log = log.toString();
    if (/associated/.test(log) || /deauthenticated/.test(log) || /disassociated/.test(log)) {
        let [, msg] = log.split("wlan0: ") || [];
        if (msg) {
            msg = replaceMacWithName(msg);
            users.forEach(user => bot.sendMessage(user, msg))
        }
    }
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(process.env.PORT);

