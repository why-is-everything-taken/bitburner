/** @param {NS} ns */
import BaseServer from 'libs/serverinfo.js';
import dpList from 'scripts/serverList.js';

export async function main(ns) {
  let target = new BaseServer(ns, ns.args[0]);
  ns.disableLog('ALL');
  let sList = dpList(ns);
  let servers = [];
  for (let s of sList) {
    await ns.scp(['shared/wk.js', 'shared/gr.js', 'shared/hk.js'], s, 'home');
    let server = new BaseServer(ns, s);
    servers.push(server);
  }
  while (true) {
    for (let server of servers) {
      //divert all threads to most valuable command
      if (server.admin && target.admin) {
        //weakens target if Security > Min Security
        if (target.security.level > target.security.min + 5) {
          let available_threads = server.threadCount(1.75);
          if (available_threads >= 1) {
            ns.exec('shared/wk.js', server.id, available_threads, target.id);
          }
        }
        //grows target if Money Available < Max Money
        else if (target.money.available < target.money.max * .75) {
          let available_threads = server.threadCount(1.75);
          if (available_threads >= 1) {
            ns.exec('shared/gr.js', server.id, available_threads, target.id);
          }
        }
        //hack the target if previous conditions are met
        else {
          let available_threads = server.threadCount(1.7);
          if (available_threads >= 1) {
            ns.exec('shared/hk.js', server.id, available_threads, target.id);
          }
        }
      }
      //open ports and nuke if we don't have root access
      else {
        try {
          ns.brutessh(server.id)
          ns.ftpcrack(server.id)
          ns.relaysmtp(server.id)
          ns.httpworm(server.id)
          ns.sqlinject(server.id)
        } catch { }
        try {
          ns.nuke(server.id);
        } catch { }
      }
    } await ns.sleep(100);
  }
}
