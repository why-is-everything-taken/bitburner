/** @param {NS} ns */
export async function main(ns) {
  let maxServ = ns.getPurchasedServerLimit();
  let curServ = ns.getPurchasedServers().length;
  let servers = [];
  let availableCash = ns.getServerMoneyAvailable('home');
  let pServs = new Set(['home']);
  pServs.forEach(a => ns.scan(a).forEach(b => b.match('pserv') && pServs.add(b).delete('home')));
  while (true) {
    await ns.sleep(200);
    if (ns.getPurchasedServerCost(16) < ns.getServerMoneyAvailable('home') && maxServ > curServ) {
      ns.purchaseServer("pserv-" + curServ, 16);
      ns.tprint('Buying pserv-' + curServ + ' with 16 GB of RAM');
      curServ++;
    }
    for (let ps of pServs) {
      availableCash = ns.getServerMoneyAvailable('home');
      if (ns.getServerMaxRam(ps) < 2 ** 20 && ns.getPurchasedServerUpgradeCost(ps, ns.getServerMaxRam(ps) * 2) < availableCash) {
        ns.upgradePurchasedServer(ps, (ns.getServerMaxRam(ps) * 2));
        ns.tprint('Upgrading ' + ps + ' to ' + ns.getServerMaxRam(ps) + ' GB of RAM');
      } else if (ns.getServerMaxRam('pserv-24') == 2 ** 20) {
        ns.exit();
      }
    }
  }
}
