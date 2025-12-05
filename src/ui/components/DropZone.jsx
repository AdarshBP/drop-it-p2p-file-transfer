import React from 'react'

export default function DropZone({ onFiles }){
  return (
    <div className="relative group" 
      tabIndex={0}
      onDragEnter={e=>{ e.preventDefault() }}
      onDragOver={e=>{ e.preventDefault() }}
      onDrop={e=>{ e.preventDefault(); onFiles(Array.from(e.dataTransfer.files||[])) }}>
      <div className="border-3 border-dashed border-[var(--border)] rounded-2xl p-12 text-center bg-gradient-to-br from-[var(--bg-soft)] to-[var(--card)] hover:from-[var(--card)] hover:to-[var(--card-hover)] transition-all duration-300 group-hover:border-[var(--primary)] group-hover:shadow-lg cursor-pointer">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-5xl">📦</span>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-[var(--text)]">Drag & drop files here</p>
            <p className="text-sm text-[var(--muted)]">or</p>
          </div>
          <label className="cursor-pointer">
            <input type="file" multiple className="hidden" onChange={e=> onFiles(Array.from(e.target.files||[]))} />
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
              📂 Browse Files
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
