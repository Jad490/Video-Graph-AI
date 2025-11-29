import React, { useState, useRef, useEffect } from 'react'
import {
  Upload,
  Cpu,
  Network,
  Type,
  CheckCircle2,
  AlertCircle,
  Clock,
  Settings,
  Key,
  X,
  Loader2,
} from 'lucide-react'

import { extractFramesFromVideo } from './utils/video'
import { MOCK_SCENARIO } from './utils/gemini'
import { ForceGraph } from './components/ForceGraph'

export default function App() {
  const [videoSrc, setVideoSrc] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processStep, setProcessStep] = useState('')
  const [resultData, setResultData] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 })

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerSize({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        })
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [resultData])

  const handleFile = file => {
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
      setResultData(null)
      setProgress(0)
      setErrorMsg('')
    }
  }

  const handleDragOver = e => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = e => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const runAnalysis = async () => {
    if (!videoSrc) return
    setIsProcessing(true)
    setErrorMsg('')
    setResultData(null)

    try {
      if (apiKey && apiKey.length > 10) {
        setProcessStep('Scanning video structure...')
        setProgress(10)

        setProcessStep('Extracting keyframes for vision model...')
        const frames = await extractFramesFromVideo(videoSrc, 1.5, 12)
        setProgress(40)

        setProcessStep(`Sending ${frames.length} frames to backend API...`)
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey, frames }),
        })
        if (!response.ok) {
          const err = await response.json().catch(() => ({}))
          throw new Error(err.error || 'Backend API Error')
        }
        const aiResult = await response.json()
        setProgress(80)

        setProcessStep('Building Knowledge Graph...')
        await new Promise(r => setTimeout(r, 500))

        setResultData(aiResult)
        setProgress(100)
      } else {
        setProcessStep('No API Key detected. Initializing Demo Mode...')
        setProgress(20)
        await new Promise(r => setTimeout(r, 1000))
        setProcessStep('Simulating Vision Transformer...')
        setProgress(60)
        await new Promise(r => setTimeout(r, 1000))
        setResultData(MOCK_SCENARIO)
        setProgress(100)
      }
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Analysis Failed')
      setResultData(null)
    } finally {
      setIsProcessing(false)
    }
  }

  // Export JSON handler
  const handleExportJSON = () => {
    if (!resultData) return

    const dataStr = JSON.stringify(resultData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'videograph_result.json'
    document.body.appendChild(a)
    a.click()
    a.remove()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              VideoGraph AI
            </h1>
            {/* subtitle removed on purpose */}
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowSettings(true)}
            className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all ${apiKey
                ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
          >
            {apiKey ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <Settings className="w-3 h-3" />
            )}
            {apiKey ? 'API Configured' : 'Configure API'}
          </button>
          {/* Share button removed */}
        </div>
      </header>

      {showSettings && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-400" /> API Configuration
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-600"
                />
                <p className="text-[10px] text-slate-500 mt-2">
                  Your key is used locally for this session only. We do not store it.
                </p>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex overflow-hidden">
        <div className="w-5/12 flex flex-col border-r border-slate-800 bg-slate-950/50">
          <div className="relative aspect-video bg-black flex items-center justify-center group border-b border-slate-800">
            {videoSrc ? (
              <>
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className="w-full h-full object-contain"
                  controls
                  onTimeUpdate={() =>
                    videoRef.current && setCurrentTime(videoRef.current.currentTime)
                  }
                />
                {!isProcessing && (
                  <button
                    onClick={runAnalysis}
                    className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg border border-white/10 flex items-center gap-2 transition-all text-sm z-10"
                  >
                    <Cpu className="w-4 h-4" />
                    {resultData ? 'Re-Analyze' : 'Analyze Video'}
                  </button>
                )}
              </>
            ) : (
              <div
                className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-slate-700'
                  } transition-all p-8 text-center`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="bg-slate-900 p-4 rounded-full mb-4">
                  <Upload className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-300 font-medium">Drop video to start</p>
                <label className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md cursor-pointer text-sm font-medium transition-colors inline-block">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={e => handleFile(e.target.files[0])}
                  />
                </label>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-20">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-xs text-blue-400 font-mono">
                    <span>STATUS</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-slate-400 animate-pulse">
                    {processStep}
                  </p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 p-8 text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-red-400">Analysis Failed</h3>
                <p className="text-sm text-slate-300 mt-2 max-w-sm">{errorMsg}</p>
                <button
                  onClick={() => setErrorMsg('')}
                  className="mt-6 text-xs bg-slate-800 px-4 py-2 rounded hover:bg-slate-700"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                <Type className="w-4 h-4 text-blue-400" />
                Timestamps &amp; Events
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
              {resultData?.captions?.map((cap, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = cap.time
                      videoRef.current.play()
                    }
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-800 ${currentTime >= cap.time &&
                      currentTime < (resultData.captions[idx + 1]?.time || 999)
                      ? 'bg-blue-900/20 border-blue-500/50'
                      : 'bg-slate-900/50 border-slate-800'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-xs font-mono text-blue-400">
                      {new Date(cap.time * 1000).toISOString().substr(14, 5)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{cap.text}</p>
                </div>
              ))}

              {!resultData && (
                <div className="text-center text-slate-600 py-10 text-sm">
                  Waiting for video analysis...
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-7/12 flex flex-col bg-slate-950 relative">
          <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-400" />
              Knowledge Graph
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{resultData?.nodes?.length || 0} Entities Detected</span>
              <button
                onClick={handleExportJSON}
                disabled={!resultData}
                className={`px-3 py-1 rounded-full border text-[11px] font-medium transition ${resultData
                    ? 'border-slate-600 text-slate-200 hover:bg-slate-800'
                    : 'border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
              >
                Export JSON
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            className="flex-1 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]"
          >
            {resultData ? (
              <ForceGraph
                nodes={resultData.nodes}
                links={resultData.links}
                width={containerSize.w}
                height={containerSize.h}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 opacity-50">
                <Network className="w-16 h-16 mb-4" />
                <p>Knowledge Graph inactive</p>
              </div>
            )}

            {resultData && (
              <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-lg shadow-xl text-xs space-y-2 select-none pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span> Person
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Object
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Location
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
