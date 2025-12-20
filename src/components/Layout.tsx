import React from 'react';
import { Outlet } from 'react-router-dom';
import UtilityControls from './UtilityControls';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Layout: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();

    const handleLanguageToggle = () => {
        setLanguage(language === 'en' ? 'tr' : 'en');
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Elements */}
            <div
                className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[100px]"
                style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }}
            />
            <div
                className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[100px]"
                style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)' }}
            />

            {/* Controls in top-right corner */}
            <div className="absolute top-4 right-4 z-20">
                <UtilityControls
                    theme={theme}
                    language={language}
                    onThemeToggle={toggleTheme}
                    onLanguageToggle={handleLanguageToggle}
                />
            </div>

            {/* Main Content */}
            <main className="container relative z-10 flex-grow py-8">
                <Outlet />
            </main>

            {/* Simple Footer */}
            <footer className="relative z-10 py-6 text-center text-color-text-secondary opacity-60 text-sm">
                <p>© {new Date().getFullYear()} Event Scheduling Tool</p>
            </footer>
        </div>
    );
};

export default Layout;
