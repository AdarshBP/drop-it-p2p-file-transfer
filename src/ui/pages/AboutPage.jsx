import React from 'react'

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--card)] to-[var(--card-hover)]">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">ℹ️</span> About DropIt
          </h2>
        </div>
        
        <div className="p-8 space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-[var(--text)] mb-3">What is DropIt?</h3>
            <p className="text-[var(--muted)] leading-relaxed">
              DropIt is a secure, peer-to-peer file sharing application that lets you transfer files directly between devices without uploading them to any server. Your files never leave your device until they're sent directly to the recipient.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-[var(--text)] mb-3">How It Works</h3>
            <ul className="space-y-3 text-[var(--muted)]">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔗</span>
                <div>
                  <strong className="text-[var(--text)]">Connect</strong> — Each device gets a unique peer ID. Share your ID with someone to establish a connection.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📁</span>
                <div>
                  <strong className="text-[var(--text)]">Drop Files</strong> — Drag and drop files or click to browse. Multiple files are supported.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <strong className="text-[var(--text)]">Send</strong> — Files are chunked and sent directly over WebRTC with automatic retry and progress tracking.
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-[var(--text)] mb-3">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--bg-soft)] rounded-xl border border-[var(--border)]">
                <div className="text-2xl mb-2">🔐</div>
                <h4 className="font-semibold text-[var(--text)] mb-1">End-to-End Encrypted</h4>
                <p className="text-sm text-[var(--muted)]">All transfers use WebRTC's built-in encryption</p>
              </div>
              <div className="p-4 bg-[var(--bg-soft)] rounded-xl border border-[var(--border)]">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-semibold text-[var(--text)] mb-1">Fast & Direct</h4>
                <p className="text-sm text-[var(--muted)]">Peer-to-peer means no server bottlenecks</p>
              </div>
              <div className="p-4 bg-[var(--bg-soft)] rounded-xl border border-[var(--border)]">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="font-semibold text-[var(--text)] mb-1">Progress Tracking</h4>
                <p className="text-sm text-[var(--muted)]">Real-time progress with speed and ETA</p>
              </div>
              <div className="p-4 bg-[var(--bg-soft)] rounded-xl border border-[var(--border)]">
                <div className="text-2xl mb-2">🌐</div>
                <h4 className="font-semibold text-[var(--text)] mb-1">Cross-Platform</h4>
                <p className="text-sm text-[var(--muted)]">Works on any device with a modern browser</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-[var(--text)] mb-3">Privacy</h3>
            <p className="text-[var(--muted)] leading-relaxed">
              We don't store, process, or have access to your files. All transfers happen directly between peers using WebRTC technology. The only server involved is used to initially establish the peer-to-peer connection.
            </p>
          </section>

          <section className="pt-4 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted)] text-center">
              Built with React + Vite • Powered by PeerJS • Styled with Tailwind CSS
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
