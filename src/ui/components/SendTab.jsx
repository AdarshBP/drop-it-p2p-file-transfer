import React from 'react'
import PeerCard from './PeerCard.jsx'
import DropZone from './DropZone.jsx'
import FileRow from './FileRow.jsx'

export default function SendTab({ 
  peerId, 
  onCopyPeerId,
  connStatus, 
  tasks, 
  onEnqueueFiles, 
  canSend, 
  speedOf, 
  onStartTask, 
  onPauseTask, 
  onResumeTask, 
  onCancelTask,
  onSendAll,
  pendingCount,
  logs,
  onClearActivity,
  debug,
  remoteDevice,
  onClearSentFiles
}) {
  const badgeClass =
    connStatus.kind==='connected' ? 'bg-green-600 text-white' :
    connStatus.kind==='error' ? 'bg-red-600 text-white' :
    'bg-slate-500 text-white'

  // Split tasks into in-progress and sent
  const inProgress = tasks.filter(t => !(Math.round((t.offset / t.file.size) * 100) >= 100 && !t.sending));
  const sent = tasks.filter(t => (Math.round((t.offset / t.file.size) * 100) >= 100 && !t.sending));

  return (
    <div className="space-y-12">
      {/* Peer Card */}
      <PeerCard peerId={peerId} onCopy={onCopyPeerId} connStatus={connStatus} debug={debug} remoteDevice={remoteDevice} />

      {/* Files Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
            <span className="text-2xl">📁</span> Files to Send
          </h2>
          {inProgress.length > 1 && (
            <button
              className="px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-soft)]/50 text-[var(--text)] text-sm font-medium transition-all duration-200 disabled:opacity-50"
              onClick={onSendAll}
              disabled={pendingCount === 0 || !canSend}
              title={pendingCount === 0 ? 'No pending files to send' : 'Send all pending files'}
            >
              ➤ Send All {pendingCount > 0 && <span className="ml-1 px-2 py-0.5 rounded-full bg-[var(--primary)]/20 text-xs">{pendingCount}</span>}
            </button>
          )}
        </div>
        <div>
          <DropZone onFiles={onEnqueueFiles} />
          <ul className="list-none mt-4 p-0 space-y-0">
            {inProgress.map(t => (
              <FileRow
                key={t.id}
                task={t}
                canSend={canSend}
                speed={speedOf(t)}
                onStart={onStartTask}
                onPause={onPauseTask}
                onResume={onResumeTask}
                onCancel={onCancelTask}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* Sent Files Section */}
      {sent.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between mt-8">
            <h2 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
              <span className="text-2xl">✅</span> Sent Files
            </h2>
            <button
              className="px-4 py-2 text-[var(--muted)] hover:text-[var(--text)] text-sm font-medium border border-[var(--border)] rounded-lg transition-all duration-200"
              onClick={onClearSentFiles}
            >
              Clear
            </button>
          </div>
          <ul className="list-none mt-4 p-0 space-y-3">
            {sent.map(t => (
              <li key={t.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4 min-h-[72px]">
                <span className="text-3xl">
                  {t.file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(t.file)} alt="" className="w-12 h-12 object-cover rounded" />
                  ) : (
                    '📄'
                  )}
                </span>
                <div>
                  <div className="font-semibold">{t.file.name}</div>
                  <div className="text-xs text-[var(--muted)]">{(t.file.size/1024).toFixed(2)} KB</div>
                </div>
              </li>
            ))}
          </ul>
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
