import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LiquidGlassLogo } from '../vendor/reactdrops/liquid-glass-logo';
import './page.css';

const logo = new URL('./logo.svg', window.location.href).href;
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function App() {
    const animation = useRef(null);
    const [reducedMotion, setReducedMotion] = useState(motionQuery.matches);

    useEffect(() => {
        const handleMotionChange = (event) => setReducedMotion(event.matches);
        motionQuery.addEventListener('change', handleMotionChange);
        return () => motionQuery.removeEventListener('change', handleMotionChange);
    }, []);

    return (
        <>
            <div className="logo-stage">
                {reducedMotion ? (
                    <img className="static-logo" src={logo} alt="计划李：方框与橙色圆点" width="184" height="184" />
                ) : (
                    <LiquidGlassLogo
                        ref={animation}
                        logo={logo}
                        mark={logo}
                        ending="logo"
                        theme="light"
                        background="#f4f4f0"
                        tileColor="#f4f4f0"
                        logoColor="#0a0a0a"
                        textColor="#0a0a0a"
                        maxDpr={1.5}
                        loop={false}
                        height="100%"
                        aria-label="计划李液态玻璃 Logo"
                    />
                )}
            </div>
            <div className="playback">
                <p aria-live="polite">{reducedMotion ? '已跟随系统偏好，显示静态 Logo。' : '一滴玻璃，凝成一个标记。'}</p>
                <button type="button" disabled={reducedMotion} onClick={() => animation.current?.replay()}>
                    重新播放 <span aria-hidden="true">↗</span>
                </button>
            </div>
        </>
    );
}

createRoot(document.getElementById('liquid-logo')).render(<App />);
