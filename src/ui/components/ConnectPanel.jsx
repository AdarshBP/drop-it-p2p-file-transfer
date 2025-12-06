import React from 'react'

export default function ConnectPanel({ targetId, onTargetChange, onConnect, onDisconnect, status }){
  const badgeClass =
    status.kind==='connected' ? 'bg-green-600 text-white' :
    status.kind==='error' ? 'bg-red-600 text-white' :
    'bg-slate-500 text-white'
  
  const isConnected = status?.kind === 'connected'

  return (
    <section className={`space-y-4 p-6 rounded-lg border-2 transition-all duration-300 ${
      isConnected ? 'border-green-500 bg-green-500/5' : 'border-transparent'
    } hover:bg-[var(--bg-soft)]/30 hover:border-[var(--primary)] transition-all duration-200`} aria-label="Connection Panel">
      <h2 className="text-lg sm:text-2xl font-bold text-[var(--text)] flex items-center gap-2">
        <span className="material-icons text-lg sm:text-2xl" aria-label="Connect">link</span> Connect
      </h2>
      <div className="space-y-4">
        <div>
          <input 
            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:outline-none transition-all duration-200 font-mono text-sm" 
            placeholder="Enter peer ID to connect" 
            value={targetId} 
            onChange={onTargetChange} 
          />
        </div>
        <div className="flex gap-3">
          {status.kind !== 'connected' ? (
            <button className="flex-1 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-soft)]/50 text-[var(--text)] font-medium transition-all duration-200" onClick={onConnect}>
              ⚡ Connect
            </button>
          ) : (
            <button className="flex-1 px-4 py-3 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-soft)]/50 text-[var(--muted)] font-medium transition-all duration-200" onClick={onDisconnect}>
              ❌ Disconnect
            </button>
          )}
        </div>
        {status.kind !== 'disconnected' && (
          <div aria-live="polite" className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${badgeClass}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              {status.text}
            </span>
          </div>
        )}
        <div className="pt-2">
          <p className="text-xs text-[var(--muted)] flex items-start gap-2">
            <span>ℹ️</span>
            <span>Works over HTTPS or localhost. For production, use your own PeerServer and TURN.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
