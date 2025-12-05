# DropIt

https://dropitz.netlify.app





Lightweight peer-to-peer file sharing (WebRTC data channel) with a simple UI.

This repository contains DropIt — a small React + Vite app that uses PeerJS for direct P2P file transfers. The UI is built with Tailwind utilities and supports chunked transfers, progress, "Send All", and planned nearby device discovery using Firebase Realtime Database.

## Features
- Peer-to-peer file transfers using PeerJS (chunked uploads + ACKs)
- Send multiple files and a `Send All` scheduler with concurrency control
- Received files list with progress and download
- Router-based UI (Transfer / About / Contact)
- Planned: "Nearby devices" discovery using Firebase Realtime Database for presence/signaling

## Quick start (development)

Requirements:
- Node.js (16+ recommended)

From project root, in PowerShell run:

```powershell
npm install
npm run dev
# open http://localhost:5173/ in your browser
```

Build for production:

```powershell
npm run build
npm run preview
```

## Code layout
- `src/ui/App.jsx` — application entry (router + navigation)
- `src/ui/pages/TransferPage.jsx` — main transfer logic and UI
- `src/ui/components/*` — smaller UI pieces (PeerCard, ConnectPanel, DropZone, FileRow, SettingsModal)
- `todo.md` — project TODOs and Firebase integration plan


See `todo.md` for a more detailed Firebase plan (present in the repo root).


```

## Troubleshooting
- If transfers stall, open the browser devtools and inspect the logs in the Activity panel (app shows internal logs). Also check the console network tab for PeerJS signaling / TURN issues.
- If PeerJS connection fails, verify ICE/TURN configuration in `Settings` modal.

## Next steps I can implement for you
- Scaffold `src/firebase.js` and a `PeersList` UI component, then integrate presence into `TransferPage.jsx` (I added TODOs in the repo to track this).
- Add Firebase Auth (Google) and DB rules if you want authenticated presence.

---
DropIt — quick, private, browser-to-browser file sharing.
