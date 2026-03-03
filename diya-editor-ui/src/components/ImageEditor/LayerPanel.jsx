/* ─── Layer Panel (Left Sidebar) ─────────────────────────────── */

/* ── Eye Icons ──────────────── */
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

export default function LayerPanel({
    layers,
    selectedId,
    onSelect,
    onToggleVisibility,
    onAddText,
    onAddLogo,
}) {
    return (
        <>
            <div className="ie-section">
                <div className="ie-section__title">Layers</div>
                <div className="ie-layer-list">
                    {layers.map((layer) => {
                        const isActive = layer.id === selectedId
                        const isHidden = !layer.visible

                        return (
                            <div
                                key={layer.id}
                                className={[
                                    'ie-layer-item',
                                    isActive && 'ie-layer-item--active',
                                    isHidden && 'ie-layer-item--hidden',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                onClick={() => onSelect(layer.id)}
                            >
                                <div className="ie-layer-item__icon">
                                    {layer.type === 'text' ? 'T' : '◎'}
                                </div>
                                <span className="ie-layer-item__label">
                                    {layer.type === 'text'
                                        ? layer.content?.slice(0, 22) || 'Empty text'
                                        : 'Logo'}
                                </span>
                                <button
                                    className="ie-layer-item__visibility"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onToggleVisibility(layer.id)
                                    }}
                                    title={isHidden ? 'Show layer' : 'Hide layer'}
                                >
                                    {isHidden ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        )
                    })}
                </div>

                <div className="ie-add-layer-row">
                    <button className="ie-add-layer-btn" onClick={onAddText}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        Text
                    </button>
                    <button className="ie-add-layer-btn" onClick={onAddLogo}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        Logo
                    </button>
                </div>
            </div>
        </>
    )
}
