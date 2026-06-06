'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button className="theme-toggle-btn" aria-label="Toggle Theme" style={{ width: 40, height: 40, background: 'transparent', border: 'none' }} />;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="theme-toggle-btn"
      aria-label="Toggle Theme"
      title="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun size={20} color="var(--text-primary)" />
      ) : (
        <Moon size={20} color="var(--text-primary)" />
      )}
    </button>
  );
}
