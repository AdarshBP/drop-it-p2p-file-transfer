import React from 'react'

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-around  text-center md:text-left">
        {/* Logo */}
        <img
          src="/logo.svg"
          alt="DropShare Logo"
          className="w-18 h-18"
        />

        {/* Text */}
        <div>
          <h1 className="text-5xl font-bold text-[var(--text)]">DropShare</h1>
          <p className="text-xl text-[var(--muted)]">
            File transfer as it should be
          </p>
        </div>
      </section>


      {/* Story Section */}
      <section className="space-y-8">
        <div className="space-y-4">
          <p className="text-lg text-[var(--muted)] leading-relaxed">
            I was working in a café with a friend, and he had a video file I needed to edit.
          </p>
          <p className="text-lg text-[var(--muted)] leading-relaxed">
            We assumed transferring it would take a few seconds. In fact, we were already planning what to do after the transfer, maybe finish the edit, maybe order another coffee, maybe even feel proud about how “efficient” we were. The café Wi-Fi looked decent, our laptops were charged, and for a moment, the universe seemed perfectly aligned for a simple file transfer.
          </p>
        </div>

        <p className="text-2xl font-semibold text-[var(--text)]">
          We were wrong.
        </p>

        <div className="space-y-3 border-l-2 border-[var(--primary)] pl-6">
          <p className="text-lg text-[var(--muted)]">
            The public Wi-Fi blocked large uploads.
          </p>
          <p className="text-lg text-[var(--muted)]">
            Email refused to cooperate.
          </p>
          <p className="text-lg text-[var(--muted)]">
            Drive wanted verification that the café's network wouldn't allow.
          </p>
          <p className="text-lg text-[var(--muted)]">
            At that point, the only thing working smoothly was the coffee machine.
          </p>
          <p className="text-lg text-[var(--muted)]">
            We even tried AirDrop—but his Android simply shrugged.
          </p>
        </div>

        <div className="pt-6 space-y-3">
          <p className="text-lg text-[var(--text)]">
            That's when it hit me:
          </p>
          <p className="text-2xl font-semibold text-[var(--primary)]">
            How is it possible that sharing a table is easier than sharing a file?
          </p>
        </div>

        <div className="pt-6 space-y-4">
          <p className="text-lg text-[var(--muted)] leading-relaxed">
            So I built a tool that transfers files directly between devices—
          </p>
          <div className="space-y-2 text-lg">
            <p className="text-[var(--text)] font-semibold">no accounts,</p>
            <p className="text-[var(--text)] font-semibold">no limits,</p>
            <p className="text-[var(--text)] font-semibold">and no cloud servers involved.</p>
          </div>
          <p className="text-2xl font-semibold text-[var(--primary)]">
            Just fast, private, device-to-device sharing.<br />Exactly how it should be.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-[var(--text)]">How It Works</h2>
        <div className="space-y-8">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary)] text-white font-bold text-sm">1</div>
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">📤 Share Your ID</h3>
              <p className="text-[var(--muted)]">Get your unique Peer ID, or generate a shareable link. Your ID can be shared via QR code, SMS, or email.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary)] text-white font-bold text-sm">2</div>
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">🔗 Connect</h3>
              <p className="text-[var(--muted)]">The other person enters your ID or clicks your link. A secure peer-to-peer connection is established instantly.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary)] text-white font-bold text-sm">3</div>
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">📁 Drop Files</h3>
              <p className="text-[var(--muted)]">Drag and drop files or click to browse. Select as many files as you want, there are no limits.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary)] text-white font-bold text-sm">4</div>
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">🎯 Send & Track</h3>
              <p className="text-[var(--muted)]">Click send and watch in real-time. Your files transfer directly with full progress tracking and speed information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why DropShare */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-[var(--text)]">Why DropShare?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-3">
            <div className="text-4xl">🔐</div>
            <h3 className="text-xl font-semibold text-[var(--text)]">100% Private</h3>
            <p className="text-[var(--muted)]">End-to-end encrypted peer-to-peer transfers. Your files never touch our servers.</p>
          </div>
          <div className="space-y-3">
            <div className="text-4xl">⚡</div>
            <h3 className="text-xl font-semibold text-[var(--text)]">Blazing Fast</h3>
            <p className="text-[var(--muted)]">Direct peer-to-peer connections mean no server bottlenecks. Maximum speed, every time.</p>
          </div>
          <div className="space-y-3">
            <div className="text-4xl">∞</div>
            <h3 className="text-xl font-semibold text-[var(--text)]">No Limits</h3>
            <p className="text-[var(--muted)]">Send files of any size, any time. No quotas, no restrictions, no surprises.</p>
          </div>
          <div className="space-y-3">
            <div className="text-4xl">🌐</div>
            <h3 className="text-xl font-semibold text-[var(--text)]">Works Everywhere</h3>
            <p className="text-[var(--muted)]">Any device, any browser. No installation, no registration, no hassle.</p>
          </div>
          <div className="space-y-3">
            <div className="text-4xl">📊</div>
            <h3 className="text-xl font-semibold text-[var(--text)]">Real-Time Tracking</h3>
            <p className="text-[var(--muted)]">Watch your files transfer with live progress, speed, and time estimates.</p>
          </div>
          <div className="space-y-3">
            <div className="text-4xl">🔗</div>
            <h3 className="text-xl font-semibold text-[var(--text)]">Shareable Links</h3>
            <p className="text-[var(--muted)]">Generate QR codes or links to share with others. They auto-connect when opened.</p>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-[var(--text)]">Privacy & Security</h2>
        <div className="space-y-4">
          <p className="text-lg text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--text)]">Your files are your files.</strong> We don't store, process, or have access to any of your data. All transfers happen directly between peers using WebRTC technology with built-in encryption.
          </p>
          <p className="text-lg text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--text)]">The only server involved</strong> is used to establish the initial peer-to-peer connection. Once connected, your files travel directly from device to device — never through our servers.
          </p>
          <p className="text-lg text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--text)]">On the same network?</strong> Even better. Your data doesn't have to leave your local network at all, keeping it under complete control.
          </p>
        </div>
      </section>

      {/* Footer */}
      <section className="text-center text-sm text-[var(--muted)] pt-12 border-t border-[var(--border)]">
        <p>Built with ❤️ by Adarsh</p>
      </section>
    </main>
  )
}
