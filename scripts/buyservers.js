/** @param {NS} ns */
export async function main(ns) {

  let servers = [];
  let maxServers = ns.getPurchasedServerLimit();
  var availableCash = ns.getServerMoneyAvailable('home');
  var allMax = false;

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
    while (servers.length === maxServers) {
      for (let i = 0; i < servers.length; i++) {
        var servRam = ns.getServerMaxRam(servers[i]) * 2;
        ns.print(servRam)
        await ns.sleep(500)
        if (servRam < (2 ** 20) && availableCash >= ns.getPurchasedServerUpgradeCost('pserv-' + i, servRam)) {
          ns.upgradePurchasedServer(servers[i], (ns.getServerMaxRam(servers[i])) * 2);
          ns.tprint('Upgrading ' + servers[i] + ' to ' + ns.getServerMaxRam(servers[i]) + ' GB of RAM');
        } else {
          for (let i = servers.length - 1; i > 0; i--) {
            if (ns.getServerMaxRam(servers[(i)]) == (2 ** 20)) {
              allMax = true;
            } else if (ns.getServerMaxRam(servers[(i)]) != (2 ** 20)) {
              allMax = false;
              break;
            }
          }
          if (allMax == true) {
            ns.exit();
          }
        }
      } await ns.sleep(500);
    }
  }
}
