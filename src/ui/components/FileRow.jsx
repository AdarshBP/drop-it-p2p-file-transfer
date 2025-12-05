import React, { useMemo } from 'react'

function bytesFmt(n){ if(n==null || isNaN(n)) return '0 B'; const u=['B','KB','MB','GB','TB']; let i=0; let x=n; while(x>=1024 && i<u.length-1){ x/=1024; i++; } return `${x.toFixed(x<10?2:1)} ${u[i]}` }
function eta(bytesRemaining, speed){ if(!speed||speed<=0) return '—'; const s=Math.ceil(bytesRemaining/speed); return `${Math.floor(s/60)}m ${s%60}s` }

export default function FileRow({ task, canSend, speed, onStart, onPause, onResume, onCancel }){
  const percent = Math.round((task.offset / task.file.size) * 100)
  const imgUrl = useMemo(()=> task.file.type.startsWith('image/') ? URL.createObjectURL(task.file) : '', [task.file])
  const isComplete = percent >= 100 && !task.sending
  
  console.log('FileRow render:', task.file.name, 'offset:', task.offset, 'size:', task.file.size, 'percent:', percent)
  
  const progressColor = task.paused ? 'bg-[var(--warning)]' : isComplete ? 'bg-green-500' : 'bg-[var(--primary)]'
  
  return (
    <li className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 mb-3 hover:shadow-lg hover:border-[var(--primary)]/30 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-600/10 flex items-center justify-center border-2 border-[var(--border)]">
            {isComplete ? (
              <span className="text-3xl">✅</span>
            ) : task.file.type.startsWith('image/') ? (
              <img className="w-full h-full object-cover" alt="" src={imgUrl} />
            ) : (
              <span className="text-3xl">📄</span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--text)] break-words mb-1">{task.file.name}</h3>
              <p className="text-xs text-[var(--muted)] font-medium">{bytesFmt(task.file.size)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative w-full h-2.5 bg-[var(--bg-soft)] rounded-full overflow-hidden shadow-inner">
              <div className={`absolute left-0 top-0 bottom-0 transition-all duration-300 shadow-sm ${progressColor}`} style={{ width: `${percent}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--muted)] font-medium">
                {isComplete ? '✅ Sent' : `${percent}% • ${bytesFmt(task.offset)}/${bytesFmt(task.file.size)}`}
              </span>
              {!isComplete && (
                <span className="text-[var(--primary)] font-semibold">
                  {bytesFmt(speed)}/s • ETA {eta(task.file.size-task.offset, speed)}
                </span>
              )}
            </div>
          </div>
          {!isComplete && (
            <div className="flex gap-2 mt-3 flex-wrap">
              <button className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200" onClick={()=> onStart(task.id)} disabled={!canSend || task.sending}>
                ▶️ Send
              </button>
              <button className="px-4 py-2 text-sm rounded-lg border-2 border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--text)] font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200" onClick={()=> onPause(task.id)} disabled={!task.sending || task.paused}>
                ⏸️ Pause
              </button>
              <button className="px-4 py-2 text-sm rounded-lg border-2 border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--text)] font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200" onClick={()=> onResume(task.id)} disabled={!task.paused}>
                ▶️ Resume
              </button>
              <button className="px-4 py-2 text-sm rounded-lg border-2 border-red-500/30 bg-red-500/5 hover:bg-red-500/20 hover:border-red-500 text-red-400 font-medium transition-all duration-200" onClick={()=> onCancel(task.id)}>
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}
