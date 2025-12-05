
// List of easy-to-remember, max 6-char names for peer IDs
import { RANDOM_PEER_NAMES } from '../../constants/config.js'

import React, { useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function PeerCard({ peerId, onCopy, connStatus, debug, remoteDevice }) {
  const qrCanvasRef = useRef(null)
  const [qrVisible, setQrVisible] = useState(false)
  const isConnected = connStatus?.kind === 'connected'
  const isLoading = !peerId || peerId === '...';

  async function handleShowQr() {
    const newVisible = !qrVisible
    setQrVisible(newVisible)
    if (newVisible) {
      setTimeout(async () => {
        try {
          if (qrCanvasRef.current) {
            const shareableUrl = `${window.location.origin}${window.location.pathname}?peer=${peerId}`
            await QRCode.toCanvas(qrCanvasRef.current, shareableUrl, { width: 200 })
          }
        } catch (err) {
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
          title: 'DropShare - Connect with me',
          text: `Connect with me on DropShare to share files! My Peer ID: ${peerId}`,
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

  // Add Material Icons font to document head if not already present
  React.useEffect(() => {
    if (!document.getElementById('material-icons-font')) {
      const link = document.createElement('link');
      link.id = 'material-icons-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <section className={`space-y-4 p-4 sm:p-6 rounded-lg border-2 transition-all duration-300 ${isConnected ? 'border-green-500 bg-green-500/5' : 'border-transparent'
      }  hover:bg-[var(--bg-soft)]/30 hover:border-[var(--primary)] transition-all duration-200`} aria-label="Your Peer ID">
      <h2 className="text-lg sm:text-2xl font-bold text-[var(--text)] flex items-center gap-2">
        <span className="material-icons text-lg sm:text-2xl" aria-label="ID">badge</span> Your Peer ID
      </h2>
      <div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 min-h-[180px]">
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-lg font-semibold text-[var(--primary)] text-center">Loading...</div>
          </div>
        ) : (
          <div className={`mb-4 p-3 sm:p-4 border border-[var(--border)] rounded-lg relative group cursor-pointer hover:bg-[var(--bg-soft)]/30 transition-all duration-200`} onClick={onCopy} title="Click to copy">
            <p className="font-mono text-sm sm:text-lg break-all text-[var(--primary)] font-semibold">{peerId}</p>
          </div>
        )}
        {isConnected && (
          <div className="mb-2 p-3 rounded-lg bg-green-50 border border-green-300 text-green-900">
            {remoteDevice && (
              <div className="mt-1 text-xs text-green-800">
                <span className="material-icons text-base align-middle mr-1" aria-label="Device">devices</span>
                <span>Remote Device: <b>{remoteDevice.platform || ''}</b> <span className="text-gray-500">({remoteDevice.userAgent})</span></span>
              </div>
            )}
            {connStatus?.text && (
              <div className="mt-1 text-xs text-green-800">
                <span>{connStatus.text}</span>
              </div>
            )}
          </div>
        )}
        {qrVisible && (
          <div className="mb-4 flex justify-center p-4 bg-white rounded-lg border border-[var(--border)]">
            <canvas ref={qrCanvasRef} />
          </div>
        )}
        <div className="space-y-3">
          <div className="flex gap-2 sm:gap-3">
            <button
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg border border-[var(--border)] hover:bg-[var(--bg-soft)]/50 text-[var(--text)] font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleShowQr}
              title="Show QR"
              disabled={isLoading}
            >
              <span className="material-icons text-base sm:text-lg" aria-label="QR">qr_code_2</span>
              {qrVisible ? 'Hide QR' : 'Show QR'}
            </button>
            <button
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg border border-[var(--border)] hover:bg-[var(--bg-soft)]/50 text-[var(--text)] font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={copyShareableLink}
              title="Copy shareable link"
              disabled={isLoading}
            >
              <span className="material-icons text-base sm:text-lg" aria-label="Copy">link</span>
              Copy Link
            </button>
          </div>
          <button
            className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg border border-[var(--border)] hover:bg-[var(--bg-soft)]/50 text-[var(--text)] font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleShare}
            title="Share via mobile"
            disabled={isLoading}
          >
            <span className="material-icons text-base sm:text-lg" aria-label="Share">share</span>
            Share
          </button>
        </div>
        <div className="pt-3">
          <p className="text-xs sm:text-sm text-[var(--muted)] flex items-start gap-2">
            <span className="material-icons text-base sm:text-lg" aria-label="Info">lightbulb</span>
            <span>Share the link to let others connect automatically.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
