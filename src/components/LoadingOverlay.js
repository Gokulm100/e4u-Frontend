function LoaderOverlay() {
    // Adjust top and height to not cover the navbar (assuming navbar height is 64px)
    const navbarHeight = 78;
    return (
        <div style={{
            position: 'fixed',
            top: navbarHeight,
            left: 0,
            width: '100vw',
            height: `calc(100vh - ${navbarHeight}px)`,
            background: 'rgba(255,255,255,0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                width: 30,
                height: 30,
                border: '3px solid #d7ddd9ff',
                borderTop: '3px solid #3f4e6fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
        </div>
    );
}

export default LoaderOverlay;