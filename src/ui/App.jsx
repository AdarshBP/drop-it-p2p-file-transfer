import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import TransferPage from './pages/TransferPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'

function TransferPageWrapper(props) {
  const [searchParams] = useSearchParams()
  const peerIdFromUrl = searchParams.get('peer')
  return <TransferPage {...props} targetPeerIdFromUrl={peerIdFromUrl} />
}

export default function App() {
  const [themeLight, setThemeLight] = useState(false)
  const [toasts, setToasts] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({ 
    chunkSize: 65536, 
    debug: false, 
    iceConfig: null, 
    concurrency: 2, 
    windowSize: 4 
  })

  function toast(msg, type = 'info') {
    const id = Math.random().toString(16)
    setToasts(ts => [...ts, { id, msg, type }])
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 2000)
  }

  function reloadApp() {
    try { window.location.replace('/') } catch {}
  }

  useEffect(() => { 
    document.body.classList.toggle('theme-light', themeLight) 
  }, [themeLight])

  // Listen for custom toast events from child components
  useEffect(() => {
    const handleToastEvent = (e) => {
      if (e.detail && e.detail.msg) {
        toast(e.detail.msg, e.detail.type || 'info')
      }
    }
    window.addEventListener('toast', handleToastEvent)
    return () => window.removeEventListener('toast', handleToastEvent)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navigation
          onThemeToggle={() => setThemeLight(v => !v)}
          onSettings={() => setShowSettings(true)}
          onReload={reloadApp}
          themeLight={themeLight}
        />

        <Routes>
          <Route 
            path="/" 
            element={
              <TransferPageWrapper
                settings={settings}
                setSettings={setSettings}
                themeLight={themeLight}
                toast={toast}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
              />
            } 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>

        {/* Toast Notifications - Top Right */}
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm">
          {toasts.map(t => (
            <div 
              key={t.id} 
              className={`px-5 py-4 rounded-xl border-2 font-semibold shadow-2xl backdrop-blur-md transform transition-all duration-300 animate-slideInRight ${
                t.type === 'success' ? 'bg-green-500/90 border-green-400 text-white' : 
                t.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : 
                'bg-blue-500/90 border-blue-400 text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
                <span>{t.msg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrowserRouter>
  )
}
