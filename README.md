# DropShare

https://dropshare.netlify.app




Lightweight peer-to-peer file sharing (WebRTC data channel) with a simple UI.

This repository contains DropShare — a small app that uses PeerJS for direct P2P file transfers. The UI is built with Tailwind utilities and supports chunked transfers, progress, "Send All" functionality

## Features
- Peer-to-peer file transfers using PeerJS (chunked uploads + ACKs)
- Send multiple files and a `Send All` scheduler with concurrency control
- Received files list with progress and download
- Planned: "Nearby devices" discovery using Firebase Realtime Database for presence/signaling

## How to use guide

### Step 1
Wait for a Peer ID to be assigned and share that Peer ID with your friend.
> **Note:** You can also use the share button or show the QR code of the same.

![Step 1 Screenshot showing Peer ID](./screenshots/Step1.png)

### Step 2
The receiver just needs to enter the Peer ID in the receiver section, or they can scan the QR code using the camera icon present on the right side of the input field.

![Step 2 Screenshot entering Peer ID](./screenshots/Step2.png)

### Step 3
On click of the connect button, the P2P connection gets established and either party can upload files and share them with each other. Shared and received files can be checked in the progress section.

![Step 3 Sending files](./screenshots/Step3.png)

![Step 4 Received files](./screenshots/Step4.png)

> [!IMPORTANT]
> **Important Note:**
> - If you need to add your own custom STUN/TURN servers, you can do so in the settings menu.
> - You can increase the chunk size and the number of simultaneous downloads in the settings menu.

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


```

## Troubleshooting
- If transfers stall, open the browser devtools and inspect the logs in the Activity panel (app shows internal logs). Also check the console network tab for PeerJS signaling / TURN issues.
- If PeerJS connection fails, verify ICE/TURN configuration in `Settings` modal.



DropShare — quick, private, browser-to-browser file sharing.
