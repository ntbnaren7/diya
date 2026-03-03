/* ─── Properties Panel (Right Sidebar) ───────────────────────── */

const FONT_OPTIONS = [
    'Inter',
    'Space Grotesk',
    'Roboto',
    'Poppins',
    'Montserrat',
    'Playfair Display',
    'DM Sans',
    'Outfit',
]

const WEIGHT_OPTIONS = [
    { label: 'Regular', value: '400' },
    { label: 'Medium', value: '500' },
    { label: 'Semibold', value: '600' },
    { label: 'Bold', value: '700' },
    { label: 'Extra Bold', value: '800' },
]

export default function PropertiesPanel({ layer, onUpdate, onDelete }) {
    if (!layer) {
        return (
            <div className="ie-empty">
                <div className="ie-empty__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                    </svg>
                </div>
                <p className="ie-empty__text">
                    Select a layer to edit<br />its properties
                </p>
            </div>
        )
    }

    const handleChange = (key, value) => {
        onUpdate(layer.id, { [key]: value })
    }

    /* ── Text Properties ──────────────────────────────────────── */
    if (layer.type === 'text') {
        return (
            <div>
                <div className="ie-section">
                    <div className="ie-section__title">Text Properties</div>

                    {/* Content */}
                    <div className="ie-prop-group">
                        <label className="ie-prop-label">Content</label>
                        <textarea
                            className="ie-prop-input ie-prop-textarea"
                            value={layer.content}
                            onChange={(e) => handleChange('content', e.target.value)}
                        />
                    </div>

                    {/* Font Family */}
                    <div className="ie-prop-group">
                        <label className="ie-prop-label">Font Family</label>
                        <select
                            className="ie-prop-input ie-prop-select"
                            value={layer.fontFamily}
                            onChange={(e) => handleChange('fontFamily', e.target.value)}
                        >
                            {FONT_OPTIONS.map((f) => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>

                    {/* Size + Weight row */}
                    <div className="ie-prop-row">
                        <div className="ie-prop-group">
                            <label className="ie-prop-label">Size</label>
                            <input
                                className="ie-prop-input"
                                type="number"
                                min={8}
                                max={200}
                                value={layer.fontSize}
                                onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                            />
                        </div>
                        <div className="ie-prop-group">
                            <label className="ie-prop-label">Weight</label>
                            <select
                                className="ie-prop-input ie-prop-select"
                                value={layer.fontWeight}
                                onChange={(e) => handleChange('fontWeight', e.target.value)}
                            >
                                {WEIGHT_OPTIONS.map((w) => (
                                    <option key={w.value} value={w.value}>{w.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Color */}
                    <div className="ie-prop-group">
                        <label className="ie-prop-label">Color</label>
                        <div className="ie-color-field">
                            <input
                                type="color"
                                className="ie-color-swatch"
                                value={layer.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                            />
                            <input
                                type="text"
                                className="ie-color-hex"
                                value={layer.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Position */}
                <div className="ie-section">
                    <div className="ie-section__title">Position</div>
                    <div className="ie-prop-row">
                        <div className="ie-prop-group">
                            <label className="ie-prop-label">X</label>
                            <input
                                className="ie-prop-input"
                                type="number"
                                value={layer.x}
                                onChange={(e) => handleChange('x', Number(e.target.value))}
                            />
                        </div>
                        <div className="ie-prop-group">
                            <label className="ie-prop-label">Y</label>
                            <input
                                className="ie-prop-input"
                                type="number"
                                value={layer.y}
                                onChange={(e) => handleChange('y', Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="ie-section">
                    <div className="ie-section__title">Actions</div>
                    <button className="ie-delete-btn" onClick={() => onDelete(layer.id)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2.5A.5.5 0 015.5 2h3a.5.5 0 01.5.5V4m1.5 0V12a1 1 0 01-1 1h-5a1 1 0 01-1-1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Delete Layer
                    </button>
                </div>
            </div>
        )
    }

    /* ── Logo Properties ──────────────────────────────────────── */
    if (layer.type === 'logo') {
        return (
            <div>
                <div className="ie-section">
                    <div className="ie-section__title">Logo Properties</div>

                    {/* Size */}
                    <div className="ie-prop-group">
                        <label className="ie-prop-label">Size (width)</label>
                        <input
                            type="range"
                            className="ie-prop-slider"
                            min={20}
                            max={200}
                            value={layer.width}
                            onChange={(e) => handleChange('width', Number(e.target.value))}
                        />
                        <input
                            className="ie-prop-input"
                            type="number"
                            min={20}
                            max={200}
                            value={layer.width}
                            onChange={(e) => handleChange('width', Number(e.target.value))}
                        />
                    </div>

                    {/* Opacity */}
                    <div className="ie-prop-group">
                        <label className="ie-prop-label">Opacity</label>
                        <input
                            type="range"
                            className="ie-prop-slider"
                            min={0}
                            max={1}
                            step={0.05}
                            value={layer.opacity}
                            onChange={(e) => handleChange('opacity', Number(e.target.value))}
                        />
                    </div>
                </div>

                {/* Position */}
                <div className="ie-section">
                    <div className="ie-section__title">Position</div>
                    <div className="ie-prop-row">
                        <div className="ie-prop-group">
                            <label className="ie-prop-label">X</label>
                            <input
                                className="ie-prop-input"
                                type="number"
                                value={layer.x}
                                onChange={(e) => handleChange('x', Number(e.target.value))}
                            />
                        </div>
                        <div className="ie-prop-group">
                            <label className="ie-prop-label">Y</label>
                            <input
                                className="ie-prop-input"
                                type="number"
                                value={layer.y}
                                onChange={(e) => handleChange('y', Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="ie-section">
                    <div className="ie-section__title">Actions</div>
                    <button className="ie-delete-btn" onClick={() => onDelete(layer.id)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2.5A.5.5 0 015.5 2h3a.5.5 0 01.5.5V4m1.5 0V12a1 1 0 01-1 1h-5a1 1 0 01-1-1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Delete Layer
                    </button>
                </div>
            </div>
        )
    }

    /* ── Image Properties ─────────────────────────────────────── */
    if (layer.type === 'image') {
        return (
            <div>
                <div className="ie-section">
                    <div className="ie-section__title">Image Properties</div>

                    {/* Name */}
                    <div className="ie-prop-group">
                        <label className="ie-prop-label">Name</label>
                        <input
                            className="ie-prop-input"
                            type="text"
                            value={layer.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>

                    {/* Size */}
                    <div className="ie-prop-group">
                        <label className="ie-prop-label">Size (width)</label>
                        <input
                            type="range"
                            className="ie-prop-slider"
                            min={20}
                            max={400}
                            value={layer.width}
                            onChange={(e) => handleChange('width', Number(e.target.value))}
                        />
                        <input
                            className="ie-prop-input"
                            type="number"
                            min={20}
                            max={400}
                            value={layer.width}
                            onChange={(e) => handleChange('width', Number(e.target.value))}
                        />
                    </div>

                    {/* Opacity */}
                    <div className="ie-prop-group">
                        <label className="ie-prop-label">Opacity</label>
                        <input
                            type="range"
                            className="ie-prop-slider"
                            min={0}
                            max={1}
                            step={0.05}
                            value={layer.opacity}
                            onChange={(e) => handleChange('opacity', Number(e.target.value))}
                        />
                    </div>
                </div>

                {/* Position */}
                <div className="ie-section">
                    <div className="ie-section__title">Position</div>
                    <div className="ie-prop-row">
                        <div className="ie-prop-group">
                            <label className="ie-prop-label">X</label>
                            <input
                                className="ie-prop-input"
                                type="number"
                                value={layer.x}
                                onChange={(e) => handleChange('x', Number(e.target.value))}
                            />
                        </div>
                        <div className="ie-prop-group">
                            <label className="ie-prop-label">Y</label>
                            <input
                                className="ie-prop-input"
                                type="number"
                                value={layer.y}
                                onChange={(e) => handleChange('y', Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="ie-section">
                    <div className="ie-section__title">Actions</div>
                    <button className="ie-delete-btn" onClick={() => onDelete(layer.id)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2.5A.5.5 0 015.5 2h3a.5.5 0 01.5.5V4m1.5 0V12a1 1 0 01-1 1h-5a1 1 0 01-1-1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Delete Layer
                    </button>
                </div>
            </div>
        )
    }

    return null
}
