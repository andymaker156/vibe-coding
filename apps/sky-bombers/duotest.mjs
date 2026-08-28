// Two-tab multiplayer harness. NOT part of the app -- a developer tool, and the
// only reliable way to debug a peer connection, since a failing tab usually
// says nothing at all.
//
// It drives ONE headless Chrome over the DevTools Protocol: tab A hosts a room,
// tab B opens the same ?room= link, and it polls window.__sb() in both.
//
//   python3 -m http.server 8777 &
//   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
//     --headless=new --enable-unsafe-swiftshader --remote-debugging-port=9333 \
//     --remote-allow-origins='*' --user-data-dir=/tmp/cdp about:blank &
//   CDP_PORT=9333 ROOM=TS1 \
//     APP_URL=http://127.0.0.1:8777/apps/sky-bombers/index.html node duotest.mjs
//
// Add --disable-features=WebRtcHideLocalIpsWithMdns to the Chrome flags if ICE
// reaches "disconnected": headless cannot resolve the <uuid>.local host
// candidates Chrome publishes by default, and that alone fails the connection
// even between two tabs on one machine.
//
// A passing run ends with A "guest joined: ..." and B connOpen=true pc=connected.

// Drive two tabs in ONE Chrome via CDP: tab A hosts, tab B joins by link.
const PORT = process.env.CDP_PORT || 9333;
const URL_BASE = process.env.APP_URL;
const ROOM = process.env.ROOM || "TST";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function newTab(url) {
  const r = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
  if (!r.ok) throw new Error("newTab failed " + r.status + " " + await r.text());
  return r.json();
}

function attach(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const logs = [];
  const ready = new Promise((res) => ws.addEventListener("open", res));
  ws.addEventListener("message", (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    if (m.method === "Runtime.consoleAPICalled") {
      logs.push(m.params.args.map((a) => a.value ?? a.description ?? "").join(" "));
    }
    if (m.method === "Runtime.exceptionThrown") {
      logs.push("EXCEPTION: " + (m.params.exceptionDetails?.exception?.description || "").split("\n")[0]);
    }
  });
  const send = async (method, params = {}) => {
    await ready;
    const mid = ++id;
    ws.send(JSON.stringify({ id: mid, method, params }));
    return new Promise((res) => pending.set(mid, res));
  };
  return {
    logs, send,
    init: async () => { await send("Runtime.enable"); await send("Log.enable"); },
    state: async () => {
      const r = await send("Runtime.evaluate", {
        expression: "JSON.stringify(window.__sb ? window.__sb() : {missing:true})",
        returnByValue: true
      });
      try { return JSON.parse(r.result?.result?.value || "{}"); } catch { return { parseFail: true }; }
    }
  };
}

const line = (tag, s) =>
  `${tag} role=${s.role} peerOpen=${s.peerOpen} disc=${s.peerDisconnected} hasConn=${s.hasConn} ` +
  `connOpen=${s.connOpen} pc=${s.pcState} sig=${s.sigState} guests=${s.guests} synced=${s.synced}` +
  (s.err ? ` err="${s.err}"` : "");

const A = await newTab(`${URL_BASE}?room=${ROOM}&peerdebug=1`);
const a = attach(A.webSocketDebuggerUrl); await a.init();
console.log("tab A (host) opened");
await sleep(7000);

const B = await newTab(`${URL_BASE}?room=${ROOM}&peerdebug=1`);
const b = attach(B.webSocketDebuggerUrl); await b.init();
console.log("tab B (join by link) opened\n");

for (let t = 0; t <= 12; t += 4) {
  await sleep(4000);
  const [sa, sb] = [await a.state(), await b.state()];
  console.log(`t+${t + 4}s`);
  console.log("  " + line("A", sa));
  console.log("  " + line("B", sb));
}
console.log("\n=== tab A log ===");
for (const l of (await a.state()).log || []) console.log("  " + l);
console.log("=== tab B log ===");
for (const l of (await b.state()).log || []) console.log("  " + l);
console.log("\n=== console A ==="); for (const l of a.logs.slice(-30)) console.log("  " + l);
console.log("=== console B ==="); for (const l of b.logs.slice(-30)) console.log("  " + l);
