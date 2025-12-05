import React from 'react'
import ConnectPanel from './ConnectPanel.jsx'

export default function ReceiveTab({ 
  targetId, 
  onTargetChange, 
  onConnect, 
  onDisconnect, 
  connStatus,
  receivedFiles,
  logs,
  onClearActivity
}) {
  return (
    <div className="space-y-12">
      {/* Connect Panel */}
      <ConnectPanel
        targetId={targetId}
        onTargetChange={onTargetChange}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        status={connStatus}
      />

      {/* Received Files */}
      {receivedFiles.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
            <span className="text-2xl">📥</span> Received Files
          </h2>
          <div>
            <ul className="list-none p-0 space-y-3">
              {receivedFiles.map(rf => {
                const percent = rf.size > 0 ? Math.round((rf.received / rf.size) * 100) : 0
                const progressColor = rf.complete ? 'bg-green-500' : 'bg-blue-500'
                
                return (
                  <li key={rf.id} className="border border-[var(--border)] rounded-lg p-4 hover:bg-[var(--bg-soft)]/30 transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <span className="text-3xl">{rf.complete ? '✅' : '📥'}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[var(--text)] break-words mb-1">{rf.name}</h3>
                            <p className="text-xs text-[var(--muted)] font-medium">
                              {(() => {
                                const received = rf.received || 0
                                const size = rf.size
                                const formatBytes = (bytes) => {
                                  if(bytes < 1024) return `${bytes} B`
                                  if(bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
                                  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
                                }
                                return `${formatBytes(received)} / ${formatBytes(size)}`
                              })()}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="relative w-full h-2.5 bg-[var(--bg-soft)] rounded-full overflow-hidden shadow-inner">
                            <div className={`absolute left-0 top-0 bottom-0 transition-all duration-300 shadow-sm ${progressColor}`} style={{ width: `${percent}%` }} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[var(--muted)] font-medium">
                              {percent}% {rf.complete ? 'Complete' : 'Receiving...'}
                            </span>
                            {rf.complete && rf.url && (
                              <a href={rf.url} download={rf.name} className="text-[var(--primary)] font-semibold hover:underline">
                                Download Again
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Activity Log */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
            <span className="text-2xl">📊</span> Activity
          </h2>
          <button 
            className="px-4 py-2 text-[var(--muted)] hover:text-[var(--text)] text-sm font-medium transition-all duration-200" 
            onClick={onClearActivity}
          >
            Clear
          </button>
        </div>
        <div className="p-4 border border-[var(--border)] rounded-lg max-h-64 overflow-y-auto">
          <div className="font-mono text-xs whitespace-pre-wrap text-[var(--muted)] leading-relaxed">
            {logs.length > 0 ? logs.join('\n') : 'No activity yet...'}
          </div>
        </div>
      </section>
    </div>
  )
}
