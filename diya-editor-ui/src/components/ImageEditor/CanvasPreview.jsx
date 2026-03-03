import { useRef, useState, useCallback, useEffect } from 'react'

/* ═══════════════════════════════════════════════════════════════
   Canvas Preview — renders image + draggable overlays
   ═══════════════════════════════════════════════════════════════ */
export default function CanvasPreview({
    layers,
    selectedId,
    zoom,
    onSelect,
    onUpdateLayer,
}) {
    const canvasRef = useRef(null)
    const [dragging, setDragging] = useState(null) // { id, startX, startY, origX, origY }

    /* ── Mouse down on element → begin drag ──────────────────── */
    const handlePointerDown = useCallback(
        (e, layer) => {
            e.stopPropagation()
            onSelect(layer.id)
            if (!layer.visible) return

            const rect = canvasRef.current.getBoundingClientRect()
            const scale = zoom / 100

            setDragging({
                id: layer.id,
                startX: e.clientX,
                startY: e.clientY,
                origX: layer.x,
                origY: layer.y,
            })
        },
        [zoom, onSelect]
    )

    /* ── Mouse move → update position ────────────────────────── */
    useEffect(() => {
        if (!dragging) return

        const handleMove = (e) => {
            const scale = zoom / 100
            const dx = (e.clientX - dragging.startX) / scale
            const dy = (e.clientY - dragging.startY) / scale
            onUpdateLayer(dragging.id, {
                x: Math.round(dragging.origX + dx),
                y: Math.round(dragging.origY + dy),
            })
        }

        const handleUp = () => {
            setDragging(null)
        }

        window.addEventListener('pointermove', handleMove)
        window.addEventListener('pointerup', handleUp)
        return () => {
            window.removeEventListener('pointermove', handleMove)
            window.removeEventListener('pointerup', handleUp)
        }
    }, [dragging, zoom, onUpdateLayer])

    /* ── Click on canvas background → deselect ──────────────── */
    const handleCanvasClick = (e) => {
        if (e.target === canvasRef.current || e.target.classList.contains('ie-canvas__bg')) {
            onSelect(null)
        }
    }

    const scale = zoom / 100

    return (
        <div
            className="ie-canvas"
            ref={canvasRef}
            style={{ transform: `scale(${scale})` }}
            onClick={handleCanvasClick}
        >
            {/* Background gradient (simulates the AI-generated image) */}
            <div className="ie-canvas__bg" />

            {/* Render layers */}
            {layers.map((layer) => {
                if (!layer.visible) return null

                if (layer.type === 'text') {
                    return (
                        <div
                            key={layer.id}
                            className={`ie-canvas-text ${selectedId === layer.id ? 'ie-canvas-text--selected' : ''}`}
                            style={{
                                left: layer.x,
                                top: layer.y,
                                fontSize: layer.fontSize,
                                fontWeight: layer.fontWeight,
                                fontFamily: layer.fontFamily,
                                color: layer.color,
                                cursor: dragging?.id === layer.id ? 'grabbing' : 'move',
                            }}
                            onPointerDown={(e) => handlePointerDown(e, layer)}
                        >
                            {layer.content}
                            {selectedId === layer.id && <SelectionOverlay />}
                        </div>
                    )
                }

                if (layer.type === 'logo') {
                    return (
                        <div
                            key={layer.id}
                            className={`ie-canvas-logo ${selectedId === layer.id ? 'ie-canvas-logo--selected' : ''}`}
                            style={{
                                left: layer.x,
                                top: layer.y,
                                width: layer.width,
                                opacity: layer.opacity,
                                cursor: dragging?.id === layer.id ? 'grabbing' : 'move',
                            }}
                            onPointerDown={(e) => handlePointerDown(e, layer)}
                        >
                            {/* Placeholder logo SVG */}
                            <svg
                                className="ie-canvas-logo__img"
                                viewBox="0 0 60 60"
                                fill="none"
                            >
                                <rect width="60" height="60" rx="12" fill="#00c237" opacity="0.9" />
                                <text x="12" y="40" fill="#fff" fontSize="28" fontWeight="700" fontFamily="Space Grotesk">
                                    D
                                </text>
                            </svg>
                            {selectedId === layer.id && <SelectionOverlay />}
                        </div>
                    )
                }

                return null
            })}
        </div>
    )
}

/* ── Selection overlay with 8 handles ─────────────────────── */
function SelectionOverlay() {
    return (
        <div className="ie-selection-box">
            <div className="ie-selection-box__border" />
            <div className="ie-selection-handle ie-selection-handle--tl" />
            <div className="ie-selection-handle ie-selection-handle--tr" />
            <div className="ie-selection-handle ie-selection-handle--bl" />
            <div className="ie-selection-handle ie-selection-handle--br" />
            <div className="ie-selection-handle ie-selection-handle--t" />
            <div className="ie-selection-handle ie-selection-handle--b" />
            <div className="ie-selection-handle ie-selection-handle--l" />
            <div className="ie-selection-handle ie-selection-handle--r" />
        </div>
    )
}
