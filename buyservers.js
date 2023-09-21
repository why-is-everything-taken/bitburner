/** @param {NS} ns */

export async function main(ns) {

  let servers = [];
  let maxServers = ns.getPurchasedServerLimit();
  var availableCash = ns.getServerMoneyAvailable('home');
  var i = 0;

  while (true) {
    let pservs = new Set(['home']);
    pservs.forEach(a => ns.scan(a).forEach(b => b.match('pserv') && pservs.add(b).delete('home')));
    for (let ps of pservs) {
      servers.push(ps);
    }
    //if we have less than 25 owned servers, buy more
    if (servers.length < maxServers) {
      if (availableCash > ns.getPurchasedServerCost(16)) {
        ns.tprint('Buying a server with 16 GB of RAM for ' + ns.getPurchasedServerCost(16));
        ns.purchaseServer('pserv-' + i, 16);
      }
    }

    while (servers.length == maxServers) {
      //check if pserv-(i) can be upgraded. if we can, and we can afford it, upgrade the ram by one level
      if (ns.getServerMaxRam(servers[i]) < (2 ** 20) && availableCash > ns.getPurchasedServerUpgradeCost(servers[i], ns.getServerMaxRam(servers[i]) * 2)) {
        ns.upgradePurchasedServer(servers[i], (ns.getServerMaxRam(servers[i])) * 2)
        ns.tprint('Upgrading ' + servers[i] + ' to ' + ns.getServerMaxRam(servers[i])+' GB of RAM');
      }
      if (i == 24) {
        i = 0;
      }
      if (i < 24) {
        i++;
      }
      await ns.sleep(1000);
    }
    await ns.sleep(1000);
  }
}
