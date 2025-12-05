import React from 'react'

export default function ContactPage() {
  const profilePhoto = '/profile.jpg'
  
  const contactLinks = [
    {
      icon: '📧',
      label: 'Email',
      value: 'bpadarsh8@gmail.com',
      href: 'mailto:bpadarsh8@gmail.com'
    },
    {
      icon: '🌐',
      label: 'Portfolio',
      value: 'adarshbp.vercel.app',
      href: 'https://adarshbp.vercel.app'
    }
  ]

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Profile Section */}
        <div className="text-center space-y-6">
          {/* Profile Photo */}
          <div className="inline-block relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--border)] shadow-lg">
              <img 
                src={profilePhoto} 
                alt="Adarsh BP" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling.style.display = 'flex'
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold" style={{display: 'none'}}>
                A
              </div>
            </div>
          </div>
          
          {/* Name & Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-[var(--text)]">
              Adarsh
            </h1>
            <p className="text-lg text-[var(--primary)] font-medium">
              Founder of DropIt
            </p>
            <p className="text-[var(--muted)]">
              Full Stack Developer
            </p>
          </div>
        </div>

        {/* Contact Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 hover:shadow-lg hover:border-[var(--primary)] transition-all duration-200 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">{link.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-1">{link.label}</h3>
                <p className="text-xs text-[var(--muted)] truncate">{link.value}</p>
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
            href="https://github.com/AdarshBP/drop-it-p2p-file-transfer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
          >
            <span>💡</span>
            <span>Found a bug? Open an issue on GitHub</span>
          </a>
        </div>
      </div>
    </main>
  )
}
