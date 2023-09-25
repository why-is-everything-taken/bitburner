/** @param {NS} ns */

import BaseServer from 'libs/serverinfo.js';
import dpList from 'scripts/wip/util.js';
import BasePlayer from 'libs/playerinfo.js';

export async function main(ns) {

  let player = new BasePlayer(ns, 'player');
  let target = new BaseServer(ns, ns.args[0]);
  ns.disableLog("ALL");
  let mock = target;
  mock.money.available = target.money.max * 0.9;
  let sList = dpList(ns);
  let servers = [];
  let hackThreads = Math.floor(ns.hackAnalyzeThreads(target.id, target.money.max * 0.1));
  let weakenThreads1 = Math.ceil((target.security.level - target.security.min) * 20);
  let growThreads = ns.formulas.hacking.growThreads(target.data, player.data, target.money.max, 1);
  let hackTime = ns.getHackTime(target.id, player.data);
  let weakenTime = hackTime * 4.0;
  let home = new BaseServer(ns, 'home');
  for (let s of sList) {
    let server = new BaseServer(ns, s);
    servers.push(server);
  }

  while (growThreads > 0 || weakenThreads1 > 0) {

    home = new BaseServer(ns, 'home');
    target = new BaseServer(ns, ns.args[0]);
    let currTime = performance.now()
    weakenThreads1 = Math.ceil((target.security.level - target.security.min) * 20);
    let growThreads = ns.formulas.hacking.growThreads(target.data, player.data, target.money.max, 1);
    let weakenThreads2 = Math.ceil(growThreads / 12.5);
    let hackTime = ns.getHackTime(target.id, player.data);
    let weakenTime = hackTime * 4.0;
    let nextLanding = weakenTime + 3000 + currTime;

    if (ns.scriptRunning('shared/bwk.js', 'home') == false && growThreads > 0 && weakenThreads1 > 0) {
      if (home.threadCount(1.8) >= (growThreads + weakenThreads1 + weakenThreads2)) {
        ns.exec('shared/bwk.js', 'home', weakenThreads1, target.id, false, nextLanding);
        await ns.sleep(40);
        ns.exec('shared/bgr.js', 'home', growThreads, target.id, false, nextLanding + 40);
        await ns.sleep(40);
        ns.exec('shared/bwk.js', 'home', weakenThreads2, target.id, false, nextLanding + 80);
        await ns.sleep(40);
      } else {
        if (weakenThreads1 > 0 && home.threadCount(1.8) > 0) {
          ns.exec('shared/bwk.js', 'home', Math.min(growThreads, home.threadCount(1.8)), target.id)
        } if (growThreads > 0 && home.threadCount(1.8) > 0) {
          ns.exec('shared/bgr.js', 'home', Math.min(growThreads, home.threadCount(1.8)), target.id)
        } if (weakenThreads2 > 0 && home.threadCount(1.8) > 0) {
          ns.exec('shared/bwk.js', 'home', Math.min(weakenThreads2, home.threadCount(1.8)), target.id)
        }
      }
    }
    await ns.sleep(10);
  }

  while (true) {

    player = new BasePlayer(ns, 'player');
    home = new BaseServer(ns, 'home');
    target = new BaseServer(ns, ns.args[0]);
    let currTime = performance.now();
    mock = target.data;
    mock.moneyAvailable = target.money.max * 0.9;
    hackThreads = Math.floor(ns.hackAnalyzeThreads(target.id, target.money.max * 0.1))
    let weakenThreads1 = Math.ceil(hackThreads / 25);
    let growThreads = Math.ceil(ns.formulas.hacking.growThreads(mock, player.data, target.money.max, 1));
    let weakenThreads2 = Math.ceil(growThreads / 12.5);
    let hackTime = ns.getHackTime(target.id, player.data);
    let weakenTime = hackTime * 4.0;
    let nextLanding = weakenTime + 3000 + currTime;
    sList = dpList(ns);

    for (let server of servers) {
      if (ns.fileExists('shared/bwk.js') == false) {
        await ns.scp(["shared/bwk.js", "shared/bgr.js", "shared/bhk.js"], server.id, "home");
      }
    }

    let batch = {
      hk: hackThreads,
      wk1: weakenThreads1,
      gr: growThreads,
      wk2: weakenThreads2
    }

    for (let server of servers) {
      let requiredRam = server.threadCount(1.75) * batch.hk;
      requiredRam += server.threadCount(1.8) * batch.wk1;
      requiredRam += server.threadCount(1.8) * batch.gr;
      requiredRam += server.threadCount(1.8) * batch.wk2;
      //ns.tprint()
      if (server.threadCount(1.8) >= (growThreads + weakenThreads1 + weakenThreads2 + hackThreads)) {
        ns.exec('shared/bhk.js', server.id, batch.hk, target.id, false, nextLanding);
        ns.exec('shared/bwk.js', server.id, batch.wk1, target.id, false, nextLanding + 40);
        ns.exec('shared/bgr.js', server.id, batch.gr, target.id, false, nextLanding + 80);
        ns.exec('shared/bwk.js', server.id, batch.wk2, target.id, false, nextLanding + 120);
      }
    }
    await ns.sleep(200);
  }
}
