import React from 'react'

export default function ConnectPanel({ targetId, onTargetChange, onConnect, onDisconnect, status }){
  const badgeClass =
    status.kind==='connected' ? 'bg-green-600 text-white' :
    status.kind==='error' ? 'bg-red-600 text-white' :
    'bg-slate-500 text-white'

  return (
    <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300" aria-label="Connection Panel">
      <div className="px-6 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--card)] to-[var(--card-hover)]">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🔗</span> Connect
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <input 
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-200 font-mono text-sm" 
            placeholder="Enter peer ID to connect" 
            value={targetId} 
            onChange={onTargetChange} 
          />
        </div>
        <div className="flex gap-3">
          {status.kind !== 'connected' ? (
            <button className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5" onClick={onConnect}>
              ⚡ Connect
            </button>
          ) : (
            <button className="flex-1 px-4 py-3 rounded-xl border-2 border-red-500/50 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500 text-red-400 font-semibold transition-all duration-200" onClick={onDisconnect}>
              ❌ Disconnect
            </button>
          )}
        </div>
        {status.kind !== 'disconnected' && (
          <div aria-live="polite" className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${badgeClass}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              {status.text}
            </span>
          </div>
        )}
        <div className="pt-2 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted)] flex items-start gap-2">
            <span>ℹ️</span>
            <span>Works over HTTPS or localhost. For production, use your own PeerServer and TURN.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
