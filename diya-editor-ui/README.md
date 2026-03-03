# 🖼️ DIYA Image Editor UI

A premium, high-performance image editing interface built for the **DIYA (Digital Identity & Yield Assistant)** ecosystem. This editor allows users to fine-tune AI-generated social media content with brand-consistent typography, logos, and layouts.

---

## 💎 Design Philosophy

The DIYA Editor is designed with a **"Premium Aurora"** aesthetic, blending absolute utility with cinematic visual flair. 

- **Glassmorphism**: Panels use deep background blurs and subtle white borders to feel like floating glass.
- **Aurora Ambient Orbs**: Dynamic blue and purple gradient orbs float softly in the background to maintain brand energy.
- **Cinematic Motion**: Every entry and interaction is powered by GSAP for smooth, deliberate transitions.
- **Brand Guardrails**: Pre-configured with DIYA's production color palette and typography (Space Grotesk & Inter).

---

## 🚀 Key Features

### 1. 🏗️ 3-Panel Professional Layout
- **Left: Layer Management**: View all text and logo elements. Toggle visibility, select layers, or add new brand assets.
- **Center: Live Canvas**: A 500x500 high-fidelity workspace with absolute positioning and real-time rendering.
- **Right: Contextual Properties**: Dynamically updates based on selection. Edit text content, fonts, sizes, weights, and colors.

### 2. 🖱️ Intuitive Interactions
- **Drag-to-Move**: Direct pointer manipulation of elements on the canvas.
- **Selection System**: High-contrast dashed borders with 8-point selection handles for clear focus.
- **History Engine**: Undo and Redo support with a persistent history stack.
- **Adaptive Zoom**: Precision viewport scaling from 30% to 200%.

### 3. 🎨 Visual Consistency
- **Automatic Themes**: Uses the DIYA Brand Palette (`#00c237` default green).
- **Typography Library**: Integrated with Google Fonts (Space Grotesk for headings, Inter for body).
- **Logo Precision**: Integrated brand logo support with opacity and scale controls.

---

## 🛠️ Technical Stack

- **Framework**: React 19 (High-performance UI)
- **Tooling**: Vite 7 (Instant HMR & Build)
- **Animations**: GSAP 3 (Cinematic transitions)
- **Styling**: Vanilla CSS with CSS Variables (Maintainable & Performant)
- **Routing**: React Router 7 (Integrated navigation)

---

## 📂 Project Structure

```bash
src/
├── components/
│   └── ImageEditor/
│       ├── ImageEditor.jsx     # Main orchestrator & state manager
│       ├── ImageEditor.css     # Design system & component styles
│       ├── LayerPanel.jsx      # Left sidebar (Layer list)
│       ├── CanvasPreview.jsx   # Center area (Draggable canvas)
│       └── PropertiesPanel.jsx # Right sidebar (Contextual inputs)
├── App.jsx                     # Root entry point with mock data
└── index.css                   # Global CSS reset & brand tokens
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 📖 Component API

### `ImageEditor`
The main component for the editor module.

| Prop | Type | Description |
| :--- | :--- | :--- |
| `layers` | `Array` | Initial state of text and logo layers. |
| `postNumber` | `Number` | Reference number for the current post. |
| `onSave` | `Function` | Callback triggered on "Save & Apply". |
| `onCancel` | `Function` | Callback triggered on "Cancel". |
| `onDownload` | `Function` | Callback triggered on "Download". |

---

*DIYA — Elevate your digital orbit.* 🚀
