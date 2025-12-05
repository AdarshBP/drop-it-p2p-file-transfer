import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navigation({ onThemeToggle, onSettings, onReload, themeLight }) {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Transfer' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--bg-soft)]/80  border-[var(--border)] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="DropShare Logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">DropShare</h1>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === item.path
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'text-[var(--muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--text)] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={onThemeToggle}
              aria-label="Toggle theme"
            >
              <span className="material-icons" aria-label="Toggle theme">dark_mode</span>
            </button>
            <button
              className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--text)] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={onReload}
              title="Reload app"
              aria-label="Reload"
            >
              <span className="material-icons" aria-label="Reload">autorenew</span>
            </button>
            <button
              className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--text)] transition-all duration-200 hover:shadow-md flex items-center justify-center"
              onClick={onSettings}
              title="Open settings"
              aria-haspopup="dialog"
            >
              <span className="material-icons" aria-label="Settings">settings</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1 pb-3">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === item.path
                  ? 'bg-blue-500/10 text-blue-500'
                  : 'text-[var(--muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
