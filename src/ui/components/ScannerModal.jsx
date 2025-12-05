import React from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'

export default function ScannerModal({ onScan, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[var(--card)] p-6 rounded-2xl w-full max-w-sm mx-4 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-[var(--text)] transition-colors z-10"
                >
                    ✕
                </button>
                <h3 className="text-xl font-bold mb-4 text-center text-[var(--text)]">Scan Peer ID</h3>
                <div className="rounded-xl overflow-hidden border-2 border-[var(--primary)] aspect-square bg-black relative">
                    <Scanner
                        onScan={(result) => {
                            if (result && result.length > 0) {
                                onScan(result[0].rawValue)
                            }
                        }}
                        components={{
                            audio: false,
                            torch: false,
                        }}
                    />
                </div>
                <p className="mt-4 text-center text-sm text-[var(--muted)]">
                    Point camera at a peer's QR code
                </p>
            </div>
        </div>
    )
}
