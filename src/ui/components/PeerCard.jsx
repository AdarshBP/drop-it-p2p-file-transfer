import React, { useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function PeerCard({ peerId, onCopy }){
  const qrCanvasRef = useRef(null)
  const [qrVisible, setQrVisible] = useState(false)

  async function handleShowQr(){
    const newVisible = !qrVisible
    setQrVisible(newVisible)
    if(newVisible) {
      setTimeout(async () => {
        try { 
          if(qrCanvasRef.current) {
            const shareableUrl = `${window.location.origin}${window.location.pathname}?peer=${peerId}`
            await QRCode.toCanvas(qrCanvasRef.current, shareableUrl, { width:200 })
          }
        } catch(err) {
          console.error('QR generation error:', err)
        }
      }, 50)
    }
  }

  function copyShareableLink() {
    const url = `${window.location.origin}${window.location.pathname}?peer=${peerId}`
    navigator.clipboard.writeText(url)
      .then(() => {
        const event = new CustomEvent('toast', { detail: { msg: '🔗 Shareable link copied!', type: 'success' } })
        window.dispatchEvent(event)
      })
      .catch(() => {
        const event = new CustomEvent('toast', { detail: { msg: '❌ Copy failed', type: 'error' } })
        window.dispatchEvent(event)
      })
  }

  return (
    <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300" aria-label="Your Peer ID">
      <div className="px-6 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--card)] to-[var(--card-hover)]">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🆔</span> Your Peer ID
        </h2>
      </div>
      <div className="p-6">
        <div className="mb-4 p-4 bg-[var(--bg-soft)] rounded-xl border border-[var(--border)] relative group cursor-pointer hover:bg-[var(--card-hover)] transition-all duration-200" onClick={onCopy} title="Click to copy">
          <p className="font-mono text-sm break-all text-[var(--primary)] font-semibold">{peerId}</p>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[var(--card)]/90 rounded-xl">
            
          </div>
        </div>
        {qrVisible && (
          <div className="mb-4 flex justify-center p-4 bg-white rounded-xl shadow-inner">
            <canvas ref={qrCanvasRef} />
          </div>
        )}
        <div className="mb-4">
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--text)] font-semibold transition-all duration-200 hover:shadow-md" onClick={handleShowQr} title="Show QR">
              {qrVisible ? '❌ Hide QR' : '🔲 Show QR'}
            </button>
            <button className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5" onClick={copyShareableLink} title="Copy shareable link">
              🔗 Copy Link
            </button>
          </div>
        </div>
        <div className="pt-2 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted)] flex items-start gap-2">
            <span>💡</span>
            <span>Share the link to let others connect automatically.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
