import React from 'react'
import { CONTACT_PROFILE, CONTACT_LINKS, CONTACT_GITHUB } from '../../constants/config.js'

export default function ContactPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full space-y-8 animate-fadeInUp">
        {/* Profile Section */}
        <div className="text-center space-y-6">
          {/* Profile Photo */}
          <div className="inline-block relative">
            <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-[var(--border)] shadow-lg">
              <img 
                src={CONTACT_PROFILE.photo}
                alt={CONTACT_PROFILE.photoAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Name & Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-[var(--text)]">
              {CONTACT_PROFILE.name}
            </h1>
            <p className="text-lg text-[var(--primary)] font-medium">
              {CONTACT_PROFILE.title}
            </p>
            <p className="text-[var(--muted)]">
              {CONTACT_PROFILE.subtitle}
            </p>
          </div>
        </div>
        {/* Contact Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-[var(--border)] rounded-lg p-6 hover:bg-[var(--bg-soft)]/30 hover:border-[var(--primary)] transition-all duration-200 flex items-center gap-4"
            >
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                <span className="text-3xl">{link.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-1">{link.label}</h3>
                <p className="text-sm text-[var(--muted)] truncate">{link.value}</p>
              </div>
              <div className="text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
        {/* GitHub Link */}
        <div className="text-center pt-4">
          <a 
            href={CONTACT_GITHUB.href}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
          >
            <span>{CONTACT_GITHUB.icon}</span>
            <span>{CONTACT_GITHUB.label}</span>
          </a>
        </div>
      </div>
    </main>
  )
}
