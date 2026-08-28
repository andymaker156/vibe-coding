# Vendored libraries

This app is the one exception to the repo's zero-dependency rule, added
deliberately: real 3D and cross-device multiplayer are not reachable without
them. The files are committed here rather than fetched from a CDN so the app
keeps working when a CDN doesn't, and so there is still no build step and no
`package.json`.

| File | Package | Version | License |
|---|---|---|---|
| `three.module.min.js` | [three](https://github.com/mrdoob/three.js) | 0.180.0 | MIT |
| `three.core.min.js` | three (sibling import of the above) | 0.180.0 | MIT |
| `peerjs.min.js` | [peerjs](https://github.com/peers/peerjs) | 1.5.4 | MIT |
| `qrcode.js` | [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) | 1.4.4 | MIT |

Fetched from unpkg on 2026-08-28.

## Notes

- **three ships ESM only.** `three.min.js` (the old UMD build) is gone as of
  r150-ish, so the game loads via `<script type="module">`. Module scripts are
  CORS-blocked on `file://`, which is why this app needs to be served over
  http(s) and cannot be opened by double-clicking. Every other app in this repo
  still can.
- `three.module.min.js` bare-imports `./three.core.min.js`. Both files must sit
  in this directory, side by side.
- **PeerJS uses its public broker** (`0.peerjs.com`) for signaling only — game
  traffic goes peer-to-peer over WebRTC and never touches it. There is no server
  to deploy, but it is someone else's best-effort infrastructure, and WebRTC
  without a TURN relay can fail behind strict NATs and on some cellular
  networks.

## ICE servers (STUN / TURN)

The app configures public STUN only (Google, Cloudflare). STUN discovers your
public address; it cannot relay traffic.

**There is currently no TURN relay configured, and that is deliberate.** The
commonly-cited free relay — `turn:openrelay.metered.ca` with the
`openrelayproject` credentials — no longer issues allocations: probing it over
TCP returns `400 TURN allocate error`, and Metered's documentation now requires a
free account whose API key mints the `iceServers` array. Shipping those dead
credentials only produces a silent failure, so `TURN_SERVERS` in `index.html` is
an empty array with a comment showing what to paste.

Consequence: two devices that cannot reach each other **directly** cannot
connect at all. In practice that means guest and office wifi (client isolation
blocks device-to-device traffic) and most cellular carriers. A home network
normally works without any relay.

If a relay is added later, note that TURN is exactly that — a relay — so game
traffic passes through that third party when a direct path fails. It stays
end-to-end encrypted by DTLS; the relay cannot read it.
