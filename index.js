require('dotenv').config();
const dgram = require('dgram');
const server = dgram.createSocket('udp4');


server.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (log = new Buffer("")) => {
    log = log.toString();
    if (/associated/.test(log) || /authenticated/.test(log) || /deauthenticated/.test(log) || /disassociated/.test(log)) {
        const [, msg] = log.split("wlan0: ") || [];
        if (msg) console.log(msg);
    }
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(process.env.PORT);

