/** @param {NS} ns */

import BaseServer from 'scripts/serverinfo.js';
import dpList from 'scripts/wip/util.js';

export async function main(ns) {
  let target = new BaseServer(ns, ns.args[0]);
  ns.disableLog("ALL");
  let sList = dpList(ns);
  let servers = [];
  let server = new BaseServer(ns, s);
  while (true) {
    sList = dpList(ns);
    servers = [];
    for (let s of sList) {
      server = new BaseServer(ns, s);
      servers.push(server);
    }
    //copies files
    for (let server of servers) {
      if (ns.fileExists("shared/wk.js") == false) {
        await ns.scp(["shared/wk.js", "shared/gr.js", "shared/hk.js"], server.id, "home");
        //ns.tprint("$" + ns.getServerMaxMoney(server) + " " + server + " Has Root Access: " + ns.hasRootAccess(server) + " " + ns.getServerRequiredHackingLevel(server))
      }
    }
    for (let server of servers) {
      if (server.admin && target.admin) {

        // divert all threads to most valuable command
        // weakens target if Security > Min Security
        if (target.security.level > target.security.min + 5) {
          let available_threads = server.threadCount(1.75);
          if (available_threads >= 1) {
            ns.exec("shared/wk.js", server.id, available_threads, target.id);
          }
        }
        // grows target if Money Available < Max Money
        else if (target.money.available < target.money.max * .75) {
          let available_threads = server.threadCount(1.75);
          if (available_threads >= 1) {
            ns.exec("shared/gr.js", server.id, available_threads, target.id);
          }
        }
        // hack the target
        else {
          let available_threads = server.threadCount(1.7);
          if (available_threads >= 1) {
            ns.exec("shared/hk.js", server.id, available_threads, target.id);
          }
        }
      }
      //open ports
      else {
        try {
          ns.brutessh(server.id)
          ns.ftpcrack(server.id)
          ns.relaysmtp(server.id)
          ns.httpworm(server.id)
          ns.sqlinject(server.id)
        } catch { }

        // try to nuke all servers
        try {
          ns.nuke(server.id);
          //ns.singularity.installBackdoor(server.id);
        } catch { }
      }
    } await ns.sleep(100);
  }
}
