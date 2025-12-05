# Project TODOs

- [x] Generate AirDrop-like names
- [ ] Check availability for favorites
- [x] Rename project to DropIt
- [x] Add Send All button
- [x] Animate Send All + badge
- [ ] Propose Firebase integration (drafted)


# Firebase Integration Plan (Draft)

Goal: Use Firebase as a rendezvous/signaling layer so peers can discover each other and connect seamlessly.

Overview:
- Use Firebase Realtime Database (recommended) or Firestore for presence and optional signaling.
- Peers write a presence entry at `/peers/{peerId}` including metadata (name, timestamp).
- Use `onDisconnect()` to remove stale presence entries automatically.
- Other peers listen to `/peers` for `child_added` and `child_removed` events to discover online peers.
- When a user clicks a discovered peer, use existing PeerJS `connect(peerId)` to establish the P2P connection.

Files to add:
- `src/firebase.js` — Firebase init and helper refs.
- Small helpers: `advertisePeer(peerId, meta)`, `watchPeerList(onAdd, onRemove)`.

Security & Notes:
- Add Firebase security rules to limit writes to authenticated users or validate payloads.
- Avoid storing big data in Realtime DB; keep only metadata and small signaling messages.
- Optionally add Firebase Auth for named users and Cloud Functions for TURN credential generation.

Next steps I can implement on request:
- Scaffold `src/firebase.js` and integrate `advertisePeer()` into the Transfer page.
- Add a simple peers list UI and connect buttons.
- Add Firebase Auth (Google sign-in) and secure DB rules.

