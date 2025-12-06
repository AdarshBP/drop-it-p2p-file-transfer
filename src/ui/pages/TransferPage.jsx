import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Peer } from 'peerjs'
import SendTab from '../components/SendTab.jsx'
import ReceiveTab from '../components/ReceiveTab.jsx'
import SettingsModal from '../components/SettingsModal.jsx'
import { RANDOM_PEER_NAMES, DEFAULT_ICE_CONFIG, HEARTBEAT_INTERVAL_MS, HEARTBEAT_TIMEOUT_MS, HEARTBEAT_FAILURE_THRESHOLD } from '../../constants/config.js'

export default function TransferPage({ settings, setSettings, themeLight, toast, showSettings, setShowSettings, targetPeerIdFromUrl }) {
  const [peerId, setPeerId] = useState('...')
  // If peerId is present in URL, show initializing status
  const initialConnStatus = targetPeerIdFromUrl
    ? { kind: 'initializing', text: 'Initializing system...' }
    : { kind: 'disconnected', text: 'Disconnected' };
  const [connStatus, setConnStatus] = useState(initialConnStatus)
  const [targetId, setTargetId] = useState('')
  const [logs, setLogs] = useState([])
  const [tasks, setTasks] = useState([])
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false)
  // If peerId is present in URL, switch immediately to receive tab
  const [activeTab, setActiveTab] = useState(targetPeerIdFromUrl ? 'receive' : 'send')
  const [remoteDevice, setRemoteDevice] = useState(null)

  const peerRef = useRef(null)
  const connRef = useRef(null)
  const incomingRef = useRef(new Map())
  const tasksRef = useRef([])
  const [receivedFiles, setReceivedFiles] = useState([])
  const heartbeatIntervalRef = useRef(null)
  const lastHeartbeatRef = useRef(null)
  const heartbeatTimeoutRef = useRef(null)
  const heartbeatFailureCountRef = useRef(0)

  function log(msg){
    settings.debug && console.log('[debug]', msg)
    setLogs(l=> [...l, `[${new Date().toLocaleTimeString()}] ${typeof msg==='string'?msg:JSON.stringify(msg)}`])
  }

  function clearActivity(){
    setLogs([])
  }

  // Peer init with random name and retry on conflict
  useEffect(() => {
    let usedNames = [];
    let peerInstance = null;
    let destroyed = false;

    function getRandomName() {
      const available = RANDOM_PEER_NAMES.filter(n => !usedNames.includes(n));
      if (available.length === 0) return null;
      const idx = Math.floor(Math.random() * available.length);
      return available[idx];
    }

    function createPeerWithRandomName() {
      const name = getRandomName();
      if (!name) {
        toast('No available peer names left', 'error');
        setPeerId('...');
        return;
      }
      usedNames.push(name);
      setPeerId('...');
      // Use centralized ICE config
      const config = settings.iceConfig || DEFAULT_ICE_CONFIG;
      const p = new Peer(name, config);
      peerRef.current = p;
      peerInstance = p;
      p.on('open', id => {
        if (destroyed) return;
        setPeerId(id);
        log('Peer open ' + id);
      });
      p.on('connection', c => setupConnection(c));
      p.on('error', err => {
        log(err);
        if (err.type === 'unavailable-id' || (err.message && err.message.includes('ID is taken'))) {
          // Try another name
          log('Peer ID conflict, retrying with another name...');
          try { p.destroy(); } catch {}
          createPeerWithRandomName();
        } else {
          toast('Peer error — check server / network', 'error');
        }
      });
    }

    createPeerWithRandomName();

    return () => {
      destroyed = true;
      stopHeartbeat();
      try { peerInstance && peerInstance.destroy(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-connect from URL parameter
  useEffect(() => {
    if (targetPeerIdFromUrl && !autoConnectAttempted && peerRef.current && peerId !== '...') {
      setAutoConnectAttempted(true)
      setTargetId(targetPeerIdFromUrl)
      setConnStatus({ kind: 'initializing', text: 'Initializing system...' })
      setActiveTab('receive') // Switch to receive tab (redundant, but safe)
      setTimeout(() => {
        setConnStatus({ kind: 'connecting', text: `Trying to connect to peer ${targetPeerIdFromUrl}...` })
        try {
          if(connRef.current?.open) connRef.current.close()
          const c = peerRef.current.connect(targetPeerIdFromUrl)
          setupConnection(c)
          toast(`🔗 Auto-connecting to ${targetPeerIdFromUrl}...`, 'info')
        } catch(err){ 
          toast('Auto-connection failed', 'error')
        }
      }, 500)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPeerIdFromUrl, autoConnectAttempted, peerId])

  function setupConnection(c){
    connRef.current = c
    c.on('open', ()=>{ 
      // Send device info handshake
      try {
        c.send({ type: 'device-info', userAgent: navigator.userAgent, platform: navigator.platform })
      } catch {}
      setConnStatus({ kind:'connected', text:`Connected to ${c.peer}` })
      toast(`✅ Connected to ${c.peer}`, 'success')
      startHeartbeat()
    })
    c.on('data', handleData)
    c.on('close', ()=>{ 
      setConnStatus({ kind:'disconnected', text:'Disconnected' })
      setRemoteDevice(null)
      toast('🔌 Connection closed','info')
      stopHeartbeat()
    })
    c.on('error', err=>{ 
      log(err)
      setConnStatus({ kind:'error', text:'Connection error' })
      stopHeartbeat()
    })
  }

  function startHeartbeat() {
    stopHeartbeat() // Clear any existing heartbeat
    lastHeartbeatRef.current = Date.now()
    heartbeatFailureCountRef.current = 0
    
    // Send heartbeat every HEARTBEAT_INTERVAL_MS
    heartbeatIntervalRef.current = setInterval(() => {
      if (connRef.current?.open) {
        try {
          connRef.current.send({ type: 'heartbeat', timestamp: Date.now() })
          log('💓 Heartbeat sent')
        } catch (err) {
          log('Heartbeat send failed')
          heartbeatFailureCountRef.current++
          if (heartbeatFailureCountRef.current >= HEARTBEAT_FAILURE_THRESHOLD) {
            handleHeartbeatFailure()
          }
        }
      }
    }, HEARTBEAT_INTERVAL_MS)

    // Check for heartbeat response timeout (HEARTBEAT_TIMEOUT_MS)
    heartbeatTimeoutRef.current = setInterval(() => {
      const now = Date.now()
      if (lastHeartbeatRef.current && now - lastHeartbeatRef.current > HEARTBEAT_TIMEOUT_MS) {
        heartbeatFailureCountRef.current++
        log(`💔 Heartbeat timeout (${heartbeatFailureCountRef.current}/${HEARTBEAT_FAILURE_THRESHOLD}) - connection may be degraded`)
        if (heartbeatFailureCountRef.current >= HEARTBEAT_FAILURE_THRESHOLD) {
          handleHeartbeatFailure()
        }
      }
    }, 5000)
  }

  function stopHeartbeat() {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current)
      heartbeatTimeoutRef.current = null
    }
    lastHeartbeatRef.current = null
    heartbeatFailureCountRef.current = 0
  }

  function handleHeartbeatFailure() {
    stopHeartbeat()
    setConnStatus({ kind:'error', text:'Connection lost' })
    toast('💔 Connection lost - please reconnect', 'error')
    try {
      connRef.current?.close()
    } catch {}
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
    if (data.type === 'device-info') {
      setRemoteDevice({ userAgent: data.userAgent, platform: data.platform })
      return
    }
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

      case 'heartbeat': {
        // Respond to heartbeat
        lastHeartbeatRef.current = Date.now()
        heartbeatFailureCountRef.current = 0 // Reset failure count on successful heartbeat
        try {
          if(connRef.current?.open){
            connRef.current.send({ type:'heartbeat-ack', timestamp: Date.now() })
            log('💓 Heartbeat acknowledged')
          }
        } catch(err){ 
          log('Heartbeat ack failed')
        }
        break
      }

      case 'heartbeat-ack': {
        // Received heartbeat acknowledgment
        lastHeartbeatRef.current = Date.now()
        heartbeatFailureCountRef.current = 0 // Reset failure count on successful ack
        log('💚 Heartbeat confirmed')
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
      {/* Tab Navigation */}
      <div className="flex border-b border-[var(--border)] mb-2">
        <button
          onClick={() => setActiveTab('send')}
          className={`flex-1 px-8 py-4 font-semibold text-lg transition-all duration-200 relative ${
            activeTab === 'send'
              ? 'text-[var(--primary)]'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">📤</span>
            <span>Send</span>
          </div>
          {activeTab === 'send' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('receive')}
          className={`flex-1 px-8 py-4 font-semibold text-lg transition-all duration-200 relative ${
            activeTab === 'receive'
              ? 'text-[var(--primary)]'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">📥</span>
            <span>Receive</span>
          </div>
          {activeTab === 'receive' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]"></div>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'send' ? (
          <SendTab
            peerId={peerId}
            onCopyPeerId={copyPeerId}
            connStatus={connStatus}
            tasks={tasks}
            onEnqueueFiles={enqueue}
            canSend={canSend}
            speedOf={speedOf}
            onStartTask={startTask}
            onPauseTask={pauseTask}
            onResumeTask={resumeTask}
            onCancelTask={cancelTask}
            onSendAll={sendAll}
            pendingCount={pendingCount}
            logs={logs}
            onClearActivity={clearActivity}
            debug={settings.debug}
            remoteDevice={remoteDevice}
            onClearSentFiles={() => {
              const filtered = tasks.filter(t => !(Math.round((t.offset / t.file.size) * 100) >= 100 && !t.sending));
              tasksRef.current = filtered;
              setTasks(filtered);
            }}
          />
        ) : (
          <ReceiveTab
            targetId={targetId}
            onTargetChange={e => setTargetId(e.target.value)}
            onConnect={connect}
            onDisconnect={disconnect}
            connStatus={connStatus}
            receivedFiles={receivedFiles}
            logs={logs}
            onClearActivity={clearActivity}
            peerId={peerId}
            toast={toast}
          />
        )}
      </div>

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
