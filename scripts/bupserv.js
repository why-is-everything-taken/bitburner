/** @param {NS} ns */
export async function main(ns) {

  let minRam = 9999999;
  let curServ = 0;
  while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
    if (ns.getPurchasedServerCost(16) <= ns.getServerMoneyAvailable('home')) {
      ns.purchaseServer('pserv-' + curServ, 16)
      ns.toast('Buying pserv-' + curServ + ' with 16 GB of RAM', 'info', 5000);
      curServ++;
      if (curServ == 24) {
        curServ = 0;
      }
    }
    await ns.sleep(200);
  }
  let pServs = new Set(['home']);
  pServs.forEach(a => ns.scan(a).forEach(b => b.match('pserv') && pServs.add(b).delete('home')));
  while (ns.getPurchasedServers().length == ns.getPurchasedServerLimit()) {
    await ns.sleep(200);
    for (let ps of pServs) {
      if (ns.upgradePurchasedServer(ps, ns.getServerMaxRam(ps) * 2) == true && ns.getServerMaxRam(ps) != 2 ** 20) {
        ns.toast('Upgrading ' + ps + ' to ' + ns.getServerMaxRam(ps) + ' GB of RAM', "info", 5000);
        await ns.sleep(200);
      } if (minRam > ns.getServerMaxRam(ps)) {
        minRam = ns.getServerMaxRam(ps);
      }
    } if (minRam == 2 ** 20) {
      ns.exit();
    }
    minRam = 9999999;
  }
}
