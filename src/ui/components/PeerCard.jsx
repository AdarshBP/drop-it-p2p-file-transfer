import React, { useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function PeerCard({ peerId, onCopy }){
  const qrCanvasRef = useRef(null)
  const [qrVisible, setQrVisible] = useState(false)

  async function handleShowQr(){
    setQrVisible(true)
    try { if(qrCanvasRef.current) await QRCode.toCanvas(qrCanvasRef.current, peerId, { width:200 }) } catch {}
  }

  return (
    <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300" aria-label="Your Peer ID">
      <div className="px-6 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--card)] to-[var(--card-hover)]">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🆔</span> Your Peer ID
        </h2>
      </div>
      <div className="p-6">
        <div className="mb-4 p-4 bg-[var(--bg-soft)] rounded-xl border border-[var(--border)]">
          <p className="font-mono text-sm break-all text-[var(--primary)] font-semibold">{peerId}</p>
        </div>
        {qrVisible && (
          <div className="mb-4 flex justify-center p-4 bg-white rounded-xl shadow-inner">
            <canvas ref={qrCanvasRef} />
          </div>
        )}
        <div className="flex gap-3 mb-4">
          <button className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5" onClick={onCopy} title="Copy to clipboard">
            📋 Copy
          </button>
          <button className="px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--text)] font-semibold transition-all duration-200 hover:shadow-md" onClick={handleShowQr} title="Show QR">
            {qrVisible ? '❌ Hide QR' : '🔲 Show QR'}
          </button>
        </div>
        <div className="pt-2 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted)] flex items-start gap-2">
            <span>👉</span>
            <span>Share this ID or QR with your peer</span>
          </p>
        </div>
      </div>
    </section>
  )
}
