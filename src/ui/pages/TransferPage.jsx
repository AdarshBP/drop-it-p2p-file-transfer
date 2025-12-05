import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Peer } from 'peerjs'
import PeerCard from '../components/PeerCard.jsx'
import ConnectPanel from '../components/ConnectPanel.jsx'
import DropZone from '../components/DropZone.jsx'
import FileRow from '../components/FileRow.jsx'
import SettingsModal from '../components/SettingsModal.jsx'

export default function TransferPage({ settings, setSettings, themeLight, toast, showSettings, setShowSettings }) {
  const [peerId, setPeerId] = useState('...')
  const [connStatus, setConnStatus] = useState({ kind:'disconnected', text:'Disconnected' })
  const [targetId, setTargetId] = useState('')
  const [logs, setLogs] = useState([])
  const [tasks, setTasks] = useState([])

  const peerRef = useRef(null)
  const connRef = useRef(null)
  const incomingRef = useRef(new Map())
  const tasksRef = useRef([])
  const [receivedFiles, setReceivedFiles] = useState([])

  function log(msg){
    settings.debug && console.log('[debug]', msg)
    setLogs(l=> [...l, `[${new Date().toLocaleTimeString()}] ${typeof msg==='string'?msg:JSON.stringify(msg)}`])
  }

  function clearActivity(){
    setLogs([])
  }

  // Peer init
  useEffect(()=>{
    try {
      const p = settings.iceConfig ? new Peer(undefined, settings.iceConfig) : new Peer()
      peerRef.current = p
      p.on('open', id=>{ setPeerId(id); log('Peer open '+id) })
      p.on('connection', c=> setupConnection(c))
      p.on('error', err=>{ log(err); toast('Peer error — check server / network', 'error') })
      return ()=> { try { p.destroy() } catch{} }
    } catch(err){ toast('Peer creation failed', 'error') }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setupConnection(c){
    connRef.current = c
    c.on('open', ()=>{ setConnStatus({ kind:'connected', text:`Connected to ${c.peer}` }); toast(`✅ Connected to ${c.peer}`, 'success') })
    c.on('data', handleData)
    c.on('close', ()=>{ setConnStatus({ kind:'disconnected', text:'Disconnected' }); toast('🔌 Connection closed','info') })
    c.on('error', err=>{ log(err); setConnStatus({ kind:'error', text:'Connection error' }); toast('Connection error — retry?','error') })
  }

  function copyPeerId(){
    navigator.clipboard.writeText(peerId)
      .then(()=> { toast('📋 Copied to clipboard!','success') })
      .catch(()=> { toast('❌ Copy failed','error') })
  }

  function connect(){
    const t = targetId.trim(); if(!t){ toast('Enter target peer ID','error'); return }
    try {
      if(connRef.current?.open) connRef.current.close()
      const c = peerRef.current.connect(t)
      setupConnection(c)
    } catch(err){ toast('Connection failed — server reachable?','error') }
  }

  function disconnect(){ try{ connRef.current?.close(); toast('🔌 Disconnecting...','info') }catch{} }

  function enqueue(files){
    const incoming = files.map(f=>({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      file: f,
      offset: 0,
      sending: false,
      paused: false,
      windowInFlight: 0,
      rateSamples: [],
    }))
    const newTasks = [ ...incoming, ...tasksRef.current ]
    tasksRef.current = newTasks
    setTasks(newTasks)
  }

  async function startTask(taskId){
    const c = connRef.current
    if(!c?.open){ toast('Connect first','error'); return }
    
    const task = tasksRef.current.find(x=> x.id===taskId)
    if(!task || task.sending) return
    
    console.log('📤 START TASK:', task.file.name, 'Size:', task.file.size, 'ID:', task.id)
    
    const updated = tasksRef.current.map(t => {
      if(t.id !== taskId) return t
      return { ...t, sending:true }
    })
    tasksRef.current = updated
    setTasks(updated)
    
    try {
      c.send({ type:'file-meta', name:task.file.name, size:task.file.size, mime:task.file.type, id:task.id })
      console.log('📤 SENT META:', task.file.name)
      log(`Send meta: ${task.file.name}`)
    } catch(err){
      console.error('❌ META SEND ERROR:', err)
      toast('Failed to send meta','error')
      const reverted = tasksRef.current.map(t => t.id===taskId ? { ...t, sending:false } : t)
      tasksRef.current = reverted
      setTasks(reverted)
      return
    }
    
    pumpChunks(taskId)
  }

  async function pumpChunks(taskId){
    const c = connRef.current
    if(!c?.open){ console.log('❌ NO CONNECTION'); return }
    
    console.log('🔄 PUMP CHUNKS STARTED for', taskId)
    let chunkCount = 0
    
    while(true){
      const currentTask = tasksRef.current.find(x=> x.id===taskId)
      
      if(!currentTask){ console.log('❌ TASK NOT FOUND'); break }
      
      console.log(`📊 Loop ${chunkCount}: offset=${currentTask.offset}, size=${currentTask.file.size}, sending=${currentTask.sending}, paused=${currentTask.paused}, window=${currentTask.windowInFlight}/${settings.windowSize}`)
      
      if(!currentTask.sending || currentTask.paused || currentTask.offset >= currentTask.file.size){
        console.log('⏹️ STOPPING: sending=', currentTask.sending, 'paused=', currentTask.paused, 'complete=', currentTask.offset >= currentTask.file.size)
        break
      }
      
      if(currentTask.windowInFlight >= settings.windowSize){
        console.log('⏸️ WINDOW FULL, waiting...')
        await new Promise(resolve => setTimeout(resolve, 100))
        continue
      }
      
      const end = Math.min(currentTask.offset + settings.chunkSize, currentTask.file.size)
      const slice = currentTask.file.slice(currentTask.offset, end)
      
      try {
        const arrayBuffer = await new Promise((resolve, reject)=>{
          const reader = new FileReader()
          reader.onload = e=> resolve(e.target.result)
          reader.onerror = reject
          reader.readAsArrayBuffer(slice)
        })
        
        c.send({ type:'file-chunk', id:currentTask.id, chunk: arrayBuffer })
        chunkCount++
        console.log(`📤 SENT CHUNK #${chunkCount}: ${currentTask.offset} -> ${end} (${end - currentTask.offset} bytes)`)
        
        const sentBytes = end - currentTask.offset
        
        const updatedTasks = tasksRef.current.map(t => {
          if(t.id !== taskId) return t
          const updated = {
            ...t,
            offset: end,
            windowInFlight: t.windowInFlight + 1,
            rateSamples: [...t.rateSamples.filter(s=> performance.now()-s.t<=4000), { t: performance.now(), bytes: sentBytes }]
          }
          console.log(`📈 UPDATE: offset ${t.offset} -> ${updated.offset}, window ${t.windowInFlight} -> ${updated.windowInFlight}`)
          return updated
        })
        tasksRef.current = updatedTasks
        setTasks(updatedTasks)
        
      } catch(err){
        console.error('❌ SEND ERROR:', err)
        toast('Send error','error')
        const errorTasks = tasksRef.current.map(t => t.id===taskId ? { ...t, sending:false, paused:true } : t)
        tasksRef.current = errorTasks
        setTasks(errorTasks)
        break
      }
    }
    
    const finalTask = tasksRef.current.find(x=> x.id===taskId)
    
    if(finalTask && finalTask.offset >= finalTask.file.size){
      console.log('✅ TRANSFER COMPLETE, sending file-end')
      try { c.send({ type:'file-end', id:taskId }) } catch{}
      toast(`✅ Sent: ${finalTask.file.name}`,'success')
      const updated = tasksRef.current.map(t => t.id===taskId ? { ...t, sending:false } : t)
      const completed = updated.filter(t => t.id===taskId)
      const others = updated.filter(t => t.id!==taskId)
      const reordered = [ ...others, ...completed ]
      tasksRef.current = reordered
      setTasks(reordered)
    }
  }

  function onAck({ id, received }){
    console.log('✅ PROCESSING ACK:', id, 'received:', received)
    const updatedTasks = tasksRef.current.map(t => {
      if(t.id !== id) return t
      console.log(`✅ ACK: Decrementing window ${t.windowInFlight} -> ${t.windowInFlight - 1}`)
      return { ...t, windowInFlight: Math.max(0, t.windowInFlight - 1) }
    })
    tasksRef.current = updatedTasks
    setTasks(updatedTasks)
  }

  function speedOf(t){
    const now = performance.now()
    const samples = t.rateSamples.filter(s=> now - s.t <= 4000)
    if(samples.length===0) return 0
    const bytes = samples.reduce((a,b)=> a+b.bytes,0)
    const times = samples.map(s=> s.t)
    const span = Math.max(1, (Math.max(...times) - Math.min(...times))/1000)
    return bytes/span
  }

  function pauseTask(id){ 
    const updated = tasksRef.current.map(t => t.id===id ? { ...t, paused:true } : t)
    tasksRef.current = updated
    setTasks(updated)
  }

  function resumeTask(id){ 
    const updated = tasksRef.current.map(t => t.id===id ? { ...t, paused:false } : t)
    tasksRef.current = updated
    setTasks(updated)
    setTimeout(()=> pumpChunks(id), 0)
  }

  function cancelTask(id){ 
    const updated = tasksRef.current.filter(t=> t.id!==id)
    tasksRef.current = updated
    setTasks(updated)
  }

  function sendAll(){
    const concurrency = Math.max(1, settings.concurrency || 1)

    const scheduler = async () => {
      while(true){
        const pending = tasksRef.current.filter(t => !t.sending && !t.paused && t.offset < t.file.size)
        const inFlight = tasksRef.current.reduce((a,b)=> a + (b.sending ? 1 : 0), 0)

        if(pending.length === 0) break
        if(inFlight >= concurrency) {
          await new Promise(r => setTimeout(r, 200))
          continue
        }

        const slots = concurrency - inFlight
        const toStart = pending.slice(0, slots)
        toStart.forEach(t => startTask(t.id))

        await new Promise(r => setTimeout(r, 50))
      }
    }

    scheduler().catch(err => console.error('SendAll scheduler error', err))
  }

  function handleData(data){
    if(!data || !data.type){ log('Unknown data'); return }
    
    console.log('📥 RECEIVED:', data.type, data.id)
    
    switch(data.type){
      case 'file-meta': {
        const id = data.id || 'default'
        console.log('📥 RECEIVED META:', data.name, 'size:', data.size, 'id:', id)
        incomingRef.current.set(id, { meta: data, chunks: [], received: 0 })
        
        setReceivedFiles(rf => [{ 
          id, 
          name: data.name, 
          size: data.size, 
          received: 0, 
          complete: false 
        }, ...rf])
        
        toast(`📥 Incoming: ${data.name}`,'info')
        log(`Receiving ${data.name} (${data.size} bytes)`)
        break
      }
      
      case 'file-chunk': {
        const id = data.id || 'default'
        const incoming = incomingRef.current.get(id)
        if(!incoming){ console.log('❌ Chunk without meta'); log('Chunk without meta'); return }
        
        let chunk = data.chunk
        let arrayBuffer
        
        if(chunk instanceof ArrayBuffer){
          arrayBuffer = chunk
        } else if(chunk && chunk.buffer instanceof ArrayBuffer){
          arrayBuffer = chunk.buffer
        } else if(chunk && typeof chunk === 'object' && chunk.data){
          arrayBuffer = chunk.data instanceof ArrayBuffer ? chunk.data : chunk.data.buffer
        } else {
          console.error('❌ Invalid chunk type:', typeof chunk, chunk)
          log('Invalid chunk')
          return
        }
        
        const view = new Uint8Array(arrayBuffer)
        incoming.chunks.push(view)
        incoming.received += view.byteLength
        
        console.log(`📥 RECEIVED CHUNK: ${incoming.received} / ${incoming.meta.size} bytes`)
        
        setReceivedFiles(rf => rf.map(f => 
          f.id === id ? { ...f, received: incoming.received } : f
        ))
        
        try {
          if(connRef.current?.open){
            connRef.current.send({ type:'ack', id, received: incoming.received })
            console.log(`📤 SENT ACK: ${incoming.received} bytes`)
          }
        } catch(err){ console.error('❌ ACK send error:', err); log('ACK send error') }
        break
      }
      
      case 'file-end': {
        const id = data.id || 'default'
        const incoming = incomingRef.current.get(id)
        if(!incoming){ console.log('❌ End without meta'); log('End without meta'); return }
        
        console.log('✅ RECEIVED FILE-END, creating blob...')
        const blob = new Blob(incoming.chunks, { type: incoming.meta.mime || 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = incoming.meta.name || 'download'
        a.click()
        
        console.log('✅ DOWNLOAD TRIGGERED:', incoming.meta.name)
        
        setReceivedFiles(rf => rf.map(f => 
          f.id === id ? { ...f, complete: true, url } : f
        ))
        
        setTimeout(()=> URL.revokeObjectURL(url), 60000)
        toast(`✅ Received: ${incoming.meta.name}`,'success')
        log(`Download complete: ${incoming.meta.name}`)
        
        incomingRef.current.delete(id)
        break
      }
      
      case 'ack': {
        console.log('📥 RECEIVED ACK:', data.id, 'received:', data.received)
        onAck(data)
        break
      }
        
      default: 
        log('Unhandled type: '+data.type)
    }
  }

  const canSend = useMemo(()=> connRef.current?.open, [connRef.current?.open])
  const pendingCount = useMemo(() => {
    return tasks.filter(t => t.offset < (t.file?.size || 0) && !t.paused).length
  }, [tasks])

  return (
    <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Connection Cards */}
      <section aria-label="Connection Status" className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PeerCard peerId={peerId} onCopy={copyPeerId} />
          <ConnectPanel
            targetId={targetId}
            onTargetChange={e => setTargetId(e.target.value)}
            onConnect={connect}
            onDisconnect={disconnect}
            status={connStatus}
          />
        </div>
      </section>
      
      {/* Files */}
      <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden mb-6 shadow-xl" aria-label="Files">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--card)] to-[var(--card-hover)] flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">📁</span> Files
          </h2>
          {tasks.length > 1 && (
            <button
              className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] hover:bg-[var(--card-hover)] text-[var(--text)] text-sm font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50"
              onClick={sendAll}
              disabled={pendingCount === 0 || !canSend}
              title={pendingCount === 0 ? 'No pending files to send' : 'Send all pending files'}
            >
              ➤ Send All {pendingCount > 0 && <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs">{pendingCount}</span>}
            </button>
          )}
        </div>
        <div className="p-4">
          <DropZone onFiles={files=> enqueue(files)} />

          <ul className="list-none mt-3 p-0 space-y-0">
            {tasks.map(t=> (
              <FileRow
                key={t.id}
                task={t}
                canSend={canSend}
                speed={speedOf(t)}
                onStart={startTask}
                onPause={pauseTask}
                onResume={resumeTask}
                onCancel={cancelTask}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* Received Files */}
      {receivedFiles.length > 0 && (
        <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden mb-6 shadow-xl" aria-label="Received Files">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--card)] to-[var(--card-hover)]">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">📥</span> Received Files
            </h2>
          </div>
          <div className="p-4">
            <ul className="list-none p-0 space-y-3">
              {receivedFiles.map(rf => {
                const percent = rf.size > 0 ? Math.round((rf.received / rf.size) * 100) : 0
                const progressColor = rf.complete ? 'bg-green-500' : 'bg-blue-500'
                
                return (
                  <li key={rf.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-green-500/10 to-blue-600/10 flex items-center justify-center border-2 border-[var(--border)]">
                          <span className="text-3xl">{rf.complete ? '✅' : '📥'}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[var(--text)] break-words mb-1">{rf.name}</h3>
                            <p className="text-xs text-[var(--muted)] font-medium">
                              {(() => {
                                const received = rf.received || 0
                                const size = rf.size
                                const formatBytes = (bytes) => {
                                  if(bytes < 1024) return `${bytes} B`
                                  if(bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
                                  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
                                }
                                return `${formatBytes(received)} / ${formatBytes(size)}`
                              })()}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="relative w-full h-2.5 bg-[var(--bg-soft)] rounded-full overflow-hidden shadow-inner">
                            <div className={`absolute left-0 top-0 bottom-0 transition-all duration-300 shadow-sm ${progressColor}`} style={{ width: `${percent}%` }} />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[var(--muted)] font-medium">
                              {percent}% {rf.complete ? 'Complete' : 'Receiving...'}
                            </span>
                            {rf.complete && rf.url && (
                              <a href={rf.url} download={rf.name} className="text-[var(--primary)] font-semibold hover:underline">
                                Download Again
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Activity */}
      <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl" aria-label="Logs and Notifications">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--card)] to-[var(--card-hover)] flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">📊</span> Activity
          </h2>
          <button className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] hover:bg-[var(--card-hover)] text-[var(--text)] text-sm font-medium transition-all duration-200 hover:shadow-md" onClick={clearActivity} title="Clear activity">Clear</button>
        </div>
        <div className="p-6">
          <div className="mt-4 p-4 bg-[var(--bg-soft)] rounded-xl border border-[var(--border)]">
            <div className="font-mono text-xs whitespace-pre-wrap text-[var(--muted)] leading-relaxed">{logs.join('\n')}</div>
          </div>
        </div>
      </section>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onClose={()=> setShowSettings(false)}
          onToast={toast}
          onUpdate={patch=> setSettings(s=> ({ ...s, ...patch }))}
        />
      )}
    </main>
  )
}
