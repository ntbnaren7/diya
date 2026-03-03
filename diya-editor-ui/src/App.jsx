import ImageEditor from './components/ImageEditor'

/* ─── Mock Data ───────────────────────────────────────────────── */
const MOCK_LAYERS = [
    {
        id: 'text-1',
        type: 'text',
        content: 'TEACHING AN AI',
        x: 60,
        y: 80,
        fontSize: 42,
        fontWeight: '700',
        fontFamily: 'Space Grotesk',
        color: '#ffffff',
        visible: true,
    },
    {
        id: 'text-2',
        type: 'text',
        content: 'TO ANTICIPATE',
        x: 60,
        y: 140,
        fontSize: 42,
        fontWeight: '700',
        fontFamily: 'Space Grotesk',
        color: '#ffffff',
        visible: true,
    },
    {
        id: 'text-3',
        type: 'text',
        content: 'A GLANCE',
        x: 60,
        y: 200,
        fontSize: 42,
        fontWeight: '700',
        fontFamily: 'Space Grotesk',
        color: '#00c237',
        visible: true,
    },
    {
        id: 'text-4',
        type: 'text',
        content: 'The real-time neural mapping powering cinematic mode\'s automatic focus pull',
        x: 60,
        y: 420,
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Inter',
        color: '#ffffff',
        visible: true,
    },
    {
        id: 'logo-1',
        type: 'logo',
        x: 400,
        y: 30,
        width: 60,
        opacity: 1,
        visible: true,
    },
]

function App() {
    const handleSave = (layers) => {
        console.log('Save & Apply:', layers)
    }

    const handleCancel = () => {
        console.log('Cancel editing')
    }

    const handleDownload = () => {
        console.log('Download image')
    }

    return (
        <ImageEditor
            layers={MOCK_LAYERS}
            postNumber={96}
            onSave={handleSave}
            onCancel={handleCancel}
            onDownload={handleDownload}
        />
    )
}

export default App
