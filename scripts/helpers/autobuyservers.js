/** @param {NS} ns */
export async function main(ns) {

  let servers = [];
  let maxServers = ns.getPurchasedServerLimit();
  var availableCash;
  var allMax = false;
  var servUp = 0;
  var maxMult = 1048576;

  while (true) {
    let pservs = new Set(['home']);
    pservs.forEach(a => ns.scan(a).forEach(b => b.match('pserv') && pservs.add(b).delete('home')));
    for (let ps of pservs) {
      servers.push(ps);
    }

    //if we have less than 25 owned servers, buy more
    if (servers.length < maxServers && availableCash > ns.getPurchasedServerCost(16)) {
      ns.tprint('Buying a server with 16 GB of RAM for ' + ns.getPurchasedServerCost(16));
      ns.purchaseServer('pserv-' + servers.length, 16);
    }

    //check if pserv-(i) can be upgraded. if we can, and we can afford it, upgrade the ram by one level
    while (servers.length === ns.getPurchasedServerLimit()) {
      for (let i = 0; i < servers.length; i++) {
        availableCash = ns.getServerMoneyAvailable('home');
        servUp = ns.getServerMaxRam(servers[i]);
        if (availableCash > ns.getPurchasedServerUpgradeCost(servers[i], servUp * 2) && servUp != 2 ** 20) {
          ns.upgradePurchasedServer(servers[i], servUp * 2);
          ns.tprint('Upgrading ' + servers[i] + ' to ' + ns.getServerMaxRam(servers[i]) + ' GB of RAM');
        } else {
          if (allMax == true) {
            ns.exit();
          }
          if (ns.getServerMaxRam(servers[i]) == maxMult) {
            allMax = true;
          }
          if (ns.getServerMaxRam(servers[i]) > maxMult) {
            allMax = false;
            continue;
          }
        }
      } await ns.sleep(200);
    }
  }
}
