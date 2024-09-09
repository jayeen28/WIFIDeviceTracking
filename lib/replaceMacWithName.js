const dhcp = require('../static_dhcp');

module.exports = function (log = '') {
    let [, mac] = log.split('- ');
    mac = mac.trim();
    if (mac) {
        const name = dhcp[mac];
        if (name) return log.replace(new RegExp(mac), name);
        else return log; // If the MAC address is not found, return the original log
    }
    else return log; // If no MAC address is found, return the original log
}