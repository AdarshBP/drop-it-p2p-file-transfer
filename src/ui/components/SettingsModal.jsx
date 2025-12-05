import React from 'react'

export default function SettingsModal({ settings, onClose, onUpdate, onToast }){
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-md animate-fadeIn" role="dialog" aria-label="Settings" aria-modal="true" onClick={onClose}>
      <div className="bg-[var(--card)] text-[var(--text)] border-2 border-[var(--border)] rounded-2xl w-full max-w-2xl mx-4 shadow-2xl transform transition-all duration-300" role="document" onClick={e=> e.stopPropagation()}>
        <header className="px-6 py-5 border-b border-[var(--border)] bg-gradient-to-r from-[var(--card)] to-[var(--card-hover)]">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">⚙️</span> Settings
            </h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-soft)] transition-colors">
              <span className="text-2xl">✖️</span>
            </button>
          </div>
        </header>
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="bg-[var(--bg-soft)] p-4 rounded-xl border border-[var(--border)]">
            <label className="block text-sm font-semibold text-[var(--text)] mb-2">📦 Chunk size</label>
            <select className="w-full px-4 py-3 rounded-lg border-2 border-[var(--border)] bg-[var(--card)] text-[var(--text)] font-medium focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all" value={settings.chunkSize} onChange={e=> onUpdate({ chunkSize: parseInt(e.target.value,10) })}>
              <option value={16384}>16 KB</option>
              <option value={65536}>64 KB (Recommended)</option>
              <option value={262144}>256 KB</option>
            </select>
          </div>
          <div className="bg-[var(--bg-soft)] p-4 rounded-xl border border-[var(--border)]">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" id="debug" className="w-5 h-5 rounded border-2 border-[var(--border)] checked:bg-[var(--primary)] transition-all" checked={settings.debug} onChange={e=> onUpdate({ debug: e.target.checked })} />
              <span className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">🐛 Debug logs</span>
            </label>
          </div>
          <div className="bg-[var(--bg-soft)] p-4 rounded-xl border border-[var(--border)]">
            <label className="block text-sm font-semibold text-[var(--text)] mb-2">🌐 STUN/TURN JSON</label>
            <textarea className="w-full px-4 py-3 rounded-lg border-2 border-[var(--border)] bg-[var(--card)] text-[var(--text)] font-mono text-xs focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all" rows={5} placeholder='{"iceServers":[{"urls":"stun:stun.l.google.com:19302"}]}' onChange={e=>{
              const txt=e.target.value; try{ const cfg = txt? JSON.parse(txt): null; onUpdate({ iceConfig: cfg }) }catch{ onToast('Invalid STUN/TURN JSON','error') }
            }} />
          </div>
          <div className="bg-[var(--bg-soft)] p-4 rounded-xl border border-[var(--border)]">
            <label className="block text-sm font-semibold text-[var(--text)] mb-2">🔄 Parallel transfers</label>
            <select className="w-full px-4 py-3 rounded-lg border-2 border-[var(--border)] bg-[var(--card)] text-[var(--text)] font-medium focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all" value={settings.concurrency} onChange={e=> onUpdate({ concurrency: parseInt(e.target.value,10) })}>
              <option value={1}>1 file at a time</option>
              <option value={2}>2 files at a time</option>
              <option value={3}>3 files at a time</option>
            </select>
          </div>
          <div className="bg-[var(--bg-soft)] p-4 rounded-xl border border-[var(--border)]">
            <label className="block text-sm font-semibold text-[var(--text)] mb-2">📊 Unacked window</label>
            <select className="w-full px-4 py-3 rounded-lg border-2 border-[var(--border)] bg-[var(--card)] text-[var(--text)] font-medium focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all" value={settings.windowSize} onChange={e=> onUpdate({ windowSize: parseInt(e.target.value,10) })}>
              <option value={1}>1 chunk</option>
              <option value={2}>2 chunks</option>
              <option value={4}>4 chunks (Recommended)</option>
              <option value={8}>8 chunks</option>
            </select>
          </div>
        </div>
        <footer className="px-6 py-5 border-t border-[var(--border)] bg-[var(--bg-soft)] flex justify-end gap-3">
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5" onClick={onClose}>✓ Save & Close</button>
        </footer>
      </div>
    </div>
  )
}
