import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LiquidGlassLogo } from '../vendor/reactdrops/liquid-glass-logo';
import './nav.css';

// 站点固定从域名根提供，用根绝对路径才能在首页与实验页之间共用同一份产物。
const LOGO_BASE = '/experiments/liquid-glass-logo';
const logoLight = `${LOGO_BASE}/logo.svg`;
const logoDark = `${LOGO_BASE}/logo-dark.svg`;
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

// 颜色对齐 styles/main.css：浅色 --paper/--ink，深色模式覆盖值。
const PALETTES = {
    light: { logo: logoLight, background: '#f4f4f0', tileColor: '#f4f4f0', logoColor: '#0a0a0a' },
    dark: { logo: logoDark, background: '#121210', tileColor: '#121210', logoColor: '#ecebe4' },
};

function currentTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function NavLogo() {
    const [reducedMotion, setReducedMotion] = useState(motionQuery.matches);
    const [theme, setTheme] = useState(currentTheme);

    useEffect(() => {
        const handleMotionChange = (event) => setReducedMotion(event.matches);
        const handleThemeChange = (event) => setTheme(event.detail === 'dark' ? 'dark' : 'light');
        motionQuery.addEventListener('change', handleMotionChange);
        window.addEventListener('themechange', handleThemeChange);
        return () => {
            motionQuery.removeEventListener('change', handleMotionChange);
            window.removeEventListener('themechange', handleThemeChange);
        };
    }, []);

    const palette = PALETTES[theme];

    if (reducedMotion) {
        return <img className="nav-logo-static" src={palette.logo} alt="" width="34" height="34" />;
    }

    return (
        <LiquidGlassLogo
            key={theme}
            logo={palette.logo}
            mark={palette.logo}
            ending="logo"
            theme={theme}
            background={palette.background}
            tileColor={palette.tileColor}
            logoColor={palette.logoColor}
            textColor={palette.logoColor}
            maxDpr={1.5}
            loop={false}
            height="100%"
            aria-label="AIKev1n 标识"
        />
    );
}

const mount = document.getElementById('nav-liquid-logo');
if (mount) createRoot(mount).render(<NavLogo />);
