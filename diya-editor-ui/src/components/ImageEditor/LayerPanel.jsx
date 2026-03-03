/* ─── Layer Panel (Left Sidebar) ─────────────────────────────── */
import { useState, useRef, useEffect } from 'react'

/* ── Icons ──────────────────── */
const EyeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 7s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
)

const EyeOffIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 2l10 10M5.6 5.6a2 2 0 002.8 2.8M1 7s2.5-4 6-4c.9 0 1.7.2 2.4.5M13 7s-1.1 1.8-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const ChevronIcon = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M3.5 2L6.5 5 3.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const PlusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
)

/* ── Editable Label (double-click to rename) ─── */
function EditableLabel({ value, onCommit }) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(value)
    const inputRef = useRef(null)

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [editing])

    const commit = () => {
        setEditing(false)
        const trimmed = draft.trim()
        if (trimmed && trimmed !== value) onCommit(trimmed)
        else setDraft(value)
    }

    if (editing) {
        return (
            <input
                ref={inputRef}
                className="ie-layer-item__rename-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') commit()
                    if (e.key === 'Escape') { setDraft(value); setEditing(false) }
                }}
                onClick={(e) => e.stopPropagation()}
            />
        )
    }

    return (
        <span
            className="ie-layer-item__label"
            onDoubleClick={(e) => { e.stopPropagation(); setEditing(true) }}
            title="Double-click to rename"
        >
            {value}
        </span>
    )
}

/* ── Single Layer Row ──────────────────── */
function LayerItem({ layer, isActive, onSelect, onToggleVisibility, onRenameLayer, showRename }) {
    const isHidden = !layer.visible

    const label = layer.type === 'text'
        ? (layer.content?.slice(0, 22) || 'Empty text')
        : (layer.name || (layer.type === 'logo' ? 'Logo' : 'Image'))

    const icon = layer.type === 'text' ? 'T' : layer.type === 'logo' ? '◎' : '🖼'

    return (
        <div
            className={[
                'ie-layer-item',
                isActive && 'ie-layer-item--active',
                isHidden && 'ie-layer-item--hidden',
            ].filter(Boolean).join(' ')}
            onClick={() => onSelect(layer.id)}
        >
            <div className="ie-layer-item__icon">{icon}</div>

            {showRename ? (
                <EditableLabel
                    value={label}
                    onCommit={(name) => onRenameLayer(layer.id, name)}
                />
            ) : (
                <span className="ie-layer-item__label">{label}</span>
            )}

            <button
                className="ie-layer-item__visibility"
                onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id) }}
                title={isHidden ? 'Show layer' : 'Hide layer'}
            >
                {isHidden ? <EyeOffIcon /> : <EyeIcon />}
            </button>
        </div>
    )
}

/* ── Main Panel ────────────────────────── */
export default function LayerPanel({
    layers,
    selectedId,
    onSelect,
    onToggleVisibility,
    onAddText,
    onAddLogo,
    onAddImage,
    onRenameLayer,
}) {
    const [textGroupOpen, setTextGroupOpen] = useState(true)

    const assetLayers = layers.filter((l) => l.type === 'logo' || l.type === 'image')
    const textLayers = layers.filter((l) => l.type === 'text')

    return (
        <>
            <div className="ie-section">
                <div className="ie-section__title">Layers</div>

                <div className="ie-layer-list">
                    {/* ── Asset layers (logos + images) first ── */}
                    {assetLayers.map((layer) => (
                        <LayerItem
                            key={layer.id}
                            layer={layer}
                            isActive={layer.id === selectedId}
                            onSelect={onSelect}
                            onToggleVisibility={onToggleVisibility}
                            onRenameLayer={onRenameLayer}
                            showRename
                        />
                    ))}

                    {/* ── Text layers group (collapsible) ── */}
                    {textLayers.length > 0 && (
                        <div className="ie-layer-group">
                            <div
                                className="ie-layer-group__header"
                                onClick={() => setTextGroupOpen((o) => !o)}
                            >
                                <div className={`ie-layer-group__chevron ${textGroupOpen ? 'ie-layer-group__chevron--open' : ''}`}>
                                    <ChevronIcon />
                                </div>
                                <span className="ie-layer-group__label">Text Layers</span>
                                <span className="ie-layer-group__count">{textLayers.length}</span>
                            </div>

                            <div
                                className={`ie-layer-group__list ${textGroupOpen ? '' : 'ie-layer-group__list--collapsed'}`}
                                style={{ maxHeight: textGroupOpen ? textLayers.length * 50 + 'px' : 0 }}
                            >
                                {textLayers.map((layer) => (
                                    <LayerItem
                                        key={layer.id}
                                        layer={layer}
                                        isActive={layer.id === selectedId}
                                        onSelect={onSelect}
                                        onToggleVisibility={onToggleVisibility}
                                        onRenameLayer={onRenameLayer}
                                        showRename={false}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Add layer buttons ── */}
                <div className="ie-add-layer-row">
                    <button className="ie-add-layer-btn" onClick={onAddText}>
                        <PlusIcon /> Text
                    </button>
                    <button className="ie-add-layer-btn" onClick={onAddLogo}>
                        <PlusIcon /> Logo
                    </button>
                    <button className="ie-add-layer-btn" onClick={onAddImage}>
                        <PlusIcon /> Image
                    </button>
                </div>
            </div>
        </>
    )
}
