/** @param {NS} ns */

//get all server names
export default function dpList(ns, current = 'home', set = new Set()) {
    let connections = ns.scan(current);
    let next = connections.filter(c => !set.has(c));
    next.forEach(n => {
        set.add(n);
        return dpList(ns, n, set);
    })
    return Array.from(set.keys());
}
