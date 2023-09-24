/** @param {NS} ns */
export async function main(ns) {

// minRam is set to an arbitrary value so we can check if all servers have the maximum amount of ram
  let minRam = 9999999;
  let curServ = 0;

  //buy servers with 16GB of RAM named 'pserv-0' through 'pserv-24'
  while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
    if (ns.getPurchasedServerCost(16) <= ns.getServerMoneyAvailable('home')) {
      ns.purchaseServer('pserv-' + curServ, 16)
      ns.toast('Buying pserv-' + curServ + ' with 16 GB of RAM', "info", 5000);
      curServ++;
      if (curServ == 24) {
        curServ = 0;
      }
    }
    await ns.sleep(200);
  }
  //finds all servers starting with 'pserv'
  let pServs = new Set(['home']);
  pServs.forEach(a => ns.scan(a).forEach(b => b.match('pserv') && pServs.add(b).delete('home')));

  //checks the current Ram of a ps from pServs. If we have enough money to upgrade to the next level of RAM, upgrade the server one level and check next ps
  //if we don't have enough money, check next ps
  while (ns.getPurchasedServers().length == ns.getPurchasedServerLimit()) {
    await ns.sleep(200);
    for (let ps of pServs) {
      if (ns.upgradePurchasedServer(ps, ns.getServerMaxRam(ps) * 2) == true && ns.getServerMaxRam(ps) != 2 ** 20) {
        ns.toast('Upgrading ' + ps + ' to ' + ns.getServerMaxRam(ps) + ' GB of RAM', "info", 5000);
        await ns.sleep(200);
      } if (minRam > ns.getServerMaxRam(ps)) {
        minRam = ns.getServerMaxRam(ps);
      }
    }
    //if all pServs have RAM = (2 ** 20), kill the script
    if (minRam == 2 ** 20) {
      ns.exit();
    }
    minRam = 9999999;
  }
}
