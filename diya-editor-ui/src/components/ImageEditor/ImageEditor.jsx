import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import LayerPanel from './LayerPanel.jsx'
import CanvasPreview from './CanvasPreview.jsx'
import PropertiesPanel from './PropertiesPanel.jsx'
import './ImageEditor.css'

/* ═══════════════════════════════════════════════════════════════
   DIYA Image Editor — Orchestrator
   ═══════════════════════════════════════════════════════════════ */
export default function ImageEditor({
    layers: initialLayers,
    postNumber = 0,
    onSave,
    onCancel,
    onDownload,
}) {
    const [layers, setLayers] = useState(initialLayers)
    const [selectedId, setSelectedId] = useState(null)
    const [zoom, setZoom] = useState(100)
    const [history, setHistory] = useState([initialLayers])
    const [historyIndex, setHistoryIndex] = useState(0)

    const shellRef = useRef(null)
    const leftRef = useRef(null)
    const centerRef = useRef(null)
    const rightRef = useRef(null)
    const toolbarRef = useRef(null)
    const actionBarRef = useRef(null)

    /* ── Entrance Animation ─────────────────────────────────────── */
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        gsap.set([leftRef.current, centerRef.current, rightRef.current, toolbarRef.current, actionBarRef.current], {
            opacity: 0,
        })

        tl.fromTo(toolbarRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
            .fromTo(leftRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, '-=0.3')
            .fromTo(centerRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, '-=0.3')
            .fromTo(rightRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, '-=0.3')
            .fromTo(actionBarRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2')
    }, [])

    /* ── History (undo/redo) ────────────────────────────────────── */
    const pushHistory = useCallback((newLayers) => {
        setHistory((prev) => {
            const trimmed = prev.slice(0, historyIndex + 1)
            return [...trimmed, newLayers]
        })
        setHistoryIndex((prev) => prev + 1)
    }, [historyIndex])

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1
            setHistoryIndex(newIndex)
            setLayers(history[newIndex])
        }
    }, [history, historyIndex])

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1
            setHistoryIndex(newIndex)
            setLayers(history[newIndex])
        }
    }, [history, historyIndex])

    /* ── Layer Operations ───────────────────────────────────────── */
    const updateLayer = useCallback((id, updates) => {
        setLayers((prev) => {
            const next = prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
            pushHistory(next)
            return next
        })
    }, [pushHistory])

    const deleteLayer = useCallback((id) => {
        setLayers((prev) => {
            const next = prev.filter((l) => l.id !== id)
            pushHistory(next)
            return next
        })
        if (selectedId === id) setSelectedId(null)
    }, [pushHistory, selectedId])

    const addTextLayer = useCallback(() => {
        const newLayer = {
            id: `text-${Date.now()}`,
            type: 'text',
            content: 'New Text',
            x: 100,
            y: 100,
            fontSize: 24,
            fontWeight: '500',
            fontFamily: 'Inter',
            color: '#ffffff',
            visible: true,
        }
        setLayers((prev) => {
            const next = [...prev, newLayer]
            pushHistory(next)
            return next
        })
        setSelectedId(newLayer.id)
    }, [pushHistory])

    const addLogoLayer = useCallback(() => {
        const newLayer = {
            id: `logo-${Date.now()}`,
            type: 'logo',
            x: 200,
            y: 200,
            width: 60,
            opacity: 1,
            visible: true,
        }
        setLayers((prev) => {
            const next = [...prev, newLayer]
            pushHistory(next)
            return next
        })
        setSelectedId(newLayer.id)
    }, [pushHistory])

    const toggleVisibility = useCallback((id) => {
        setLayers((prev) => {
            const next = prev.map((l) =>
                l.id === id ? { ...l, visible: !l.visible } : l
            )
            pushHistory(next)
            return next
        })
    }, [pushHistory])

    /* ── Zoom ───────────────────────────────────────────────────── */
    const zoomIn = () => setZoom((z) => Math.min(z + 10, 200))
    const zoomOut = () => setZoom((z) => Math.max(z - 10, 30))
    const zoomReset = () => setZoom(100)

    /* ── Selected layer ref ─────────────────────────────────────── */
    const selectedLayer = layers.find((l) => l.id === selectedId) || null

    const editableCount = layers.filter((l) => l.visible).length

    return (
        <div className="ie-shell" ref={shellRef}>
            {/* Aurora ambient orbs */}
            <div className="ie-aurora ie-aurora--blue" />
            <div className="ie-aurora ie-aurora--purple" />

            {/* ── Top Toolbar ──────────────────────────────────────── */}
            <header className="ie-toolbar" ref={toolbarRef}>
                <div className="ie-toolbar__left">
                    <div className="ie-toolbar__logo">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <rect width="28" height="28" rx="8" fill="#00c237" />
                            <text x="7" y="20" fill="#fff" fontSize="16" fontWeight="700" fontFamily="Space Grotesk">D</text>
                        </svg>
                        <span className="ie-toolbar__title">Image Editor</span>
                    </div>
                </div>

                <div className="ie-toolbar__center">
                    <div className="ie-toolbar__zoom">
                        <button className="ie-toolbar__btn" onClick={zoomOut} title="Zoom out">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                        <button className="ie-toolbar__zoom-pct" onClick={zoomReset} title="Reset zoom">
                            {zoom}%
                        </button>
                        <button className="ie-toolbar__btn" onClick={zoomIn} title="Zoom in">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                    </div>
                </div>

                <div className="ie-toolbar__right">
                    <button className="ie-toolbar__btn" onClick={undo} disabled={historyIndex <= 0} title="Undo">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 6h7a3 3 0 010 6H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 3L3 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <button className="ie-toolbar__btn" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 6H6a3 3 0 000 6h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                </div>
            </header>

            {/* ── Editor Grid ──────────────────────────────────────── */}
            <main className="ie-grid">
                <aside className="ie-panel ie-panel--left" ref={leftRef}>
                    <LayerPanel
                        layers={layers}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        onToggleVisibility={toggleVisibility}
                        onAddText={addTextLayer}
                        onAddLogo={addLogoLayer}
                    />
                </aside>

                <section className="ie-canvas-area" ref={centerRef}>
                    <CanvasPreview
                        layers={layers}
                        selectedId={selectedId}
                        zoom={zoom}
                        onSelect={setSelectedId}
                        onUpdateLayer={updateLayer}
                    />
                </section>

                <aside className="ie-panel ie-panel--right" ref={rightRef}>
                    <PropertiesPanel
                        layer={selectedLayer}
                        onUpdate={updateLayer}
                        onDelete={deleteLayer}
                    />
                </aside>
            </main>

            {/* ── Bottom Action Bar ────────────────────────────────── */}
            <footer className="ie-actionbar" ref={actionBarRef}>
                <div className="ie-actionbar__info">
                    <span className="ie-actionbar__dot" />
                    <span>Post #{postNumber} · {editableCount} editable layers</span>
                </div>
                <div className="ie-actionbar__actions">
                    <button className="ie-btn ie-btn--outline" onClick={onDownload}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v9M3.5 7L7 10.5 10.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M1 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        Download
                    </button>
                    <button className="ie-btn ie-btn--ghost" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="ie-btn ie-btn--primary" onClick={() => onSave?.(layers)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5L5.5 10.5 11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Save & Apply
                    </button>
                </div>
            </footer>
        </div>
    )
}
