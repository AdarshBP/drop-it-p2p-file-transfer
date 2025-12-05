import React, { useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function PeerCard({ peerId, onCopy, connStatus }){
  const qrCanvasRef = useRef(null)
  const [qrVisible, setQrVisible] = useState(false)
  const isConnected = connStatus?.kind === 'connected'

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

  async function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}?peer=${peerId}`
    
    // Check if Web Share API is supported (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DropIt - Connect with me',
          text: `Connect with me on DropIt to share files! My Peer ID: ${peerId}`,
          url: url
        })
        const event = new CustomEvent('toast', { detail: { msg: '✅ Shared successfully!', type: 'success' } })
        window.dispatchEvent(event)
      } catch (err) {
        // User cancelled or error occurred
        if (err.name !== 'AbortError') {
          console.error('Share error:', err)
        }
      }
    } else {
      // Fallback to copy link if Web Share API not supported
      copyShareableLink()
    }
  }

  return (
    <section className={`space-y-4 p-6 rounded-lg border-2 transition-all duration-300 ${
      isConnected ? 'border-green-500 bg-green-500/5' : 'border-transparent'
    }  hover:bg-[var(--bg-soft)]/30 hover:border-[var(--primary)] transition-all duration-200`} aria-label="Your Peer ID">
      <h2 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
        <span className="text-2xl">🆔</span> Your Peer ID
      </h2>
      <div>
        <div className="mb-4 p-4 border border-[var(--border)] rounded-lg relative group cursor-pointer hover:bg-[var(--bg-soft)]/30 transition-all duration-200" onClick={onCopy} title="Click to copy">
          <p className="font-mono text-lg break-all text-[var(--primary)] font-semibold">{peerId}</p>
        </div>
        {qrVisible && (
          <div className="mb-4 flex justify-center p-4 bg-white rounded-lg border border-[var(--border)]">
            <canvas ref={qrCanvasRef} />
          </div>
        )}
        <div className="space-y-3">
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-soft)]/50 text-[var(--text)] font-medium transition-all duration-200" onClick={handleShowQr} title="Show QR">
              {qrVisible ? '❌ Hide QR' : '🔲 Show QR'}
            </button>
            <button className="flex-1 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-soft)]/50 text-[var(--text)] font-medium transition-all duration-200" onClick={copyShareableLink} title="Copy shareable link">
              🔗 Copy Link
            </button>
          </div>
          <button 
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-soft)]/50 text-[var(--text)] font-medium transition-all duration-200 flex items-center justify-center gap-2" 
            onClick={handleShare} 
            title="Share via mobile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
             Share
          </button>
        </div>
        <div className="pt-3">
          <p className="text-s text-[var(--muted)] flex items-start gap-2">
            <span>💡</span>
            <span>Share the link to let others connect automatically.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
