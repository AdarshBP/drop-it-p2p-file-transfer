import React, { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you'd send this to a backend
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--card)] to-[var(--card-hover)]">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">📧</span> Contact Us
          </h2>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-4">Get in Touch</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--text)] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--text)] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitted ? '✅ Sent!' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text)] mb-4">Connect With Us</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-[var(--bg-soft)] rounded-xl border border-[var(--border)]">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <h4 className="font-semibold text-[var(--text)] mb-1">Website</h4>
                      <a href="https://dropit.example.com" className="text-blue-500 hover:underline text-sm">
                        dropit.example.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--bg-soft)] rounded-xl border border-[var(--border)]">
                    <span className="text-2xl">💬</span>
                    <div>
                      <h4 className="font-semibold text-[var(--text)] mb-1">GitHub</h4>
                      <a href="https://github.com/dropit" className="text-blue-500 hover:underline text-sm">
                        github.com/dropit
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--bg-soft)] rounded-xl border border-[var(--border)]">
                    <span className="text-2xl">📧</span>
                    <div>
                      <h4 className="font-semibold text-[var(--text)] mb-1">Email</h4>
                      <a href="mailto:hello@dropit.example.com" className="text-blue-500 hover:underline text-sm">
                        hello@dropit.example.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl border border-[var(--border)]">
                <h4 className="font-semibold text-[var(--text)] mb-2">💡 Feature Requests</h4>
                <p className="text-sm text-[var(--muted)]">
                  Have an idea for DropIt? We'd love to hear it! Open an issue on GitHub or send us a message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
