import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { NorthLabLockup } from '../NorthLabLockup';
import { Container } from '../Container/Container';
import styles from './Header.module.scss';

interface HeaderProps {
  isLoaded: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isLoaded, theme, onToggleTheme }) => {
  return (
    <header className={`${styles.header} ${isLoaded ? styles.loaded : ''}`} role="banner">
      <Container className={styles.headerContent}>
        <NorthLabLockup className={styles.logo} ariaLabel="NorthLab" />
        <nav className={styles.nav} aria-label="Main navigation">
          <a href="#about" className="app-nav-link">About</a>
          <a href="#roadmap" className="app-nav-link">Roadmap</a>
          <a href="#faq" className="app-nav-link">FAQ</a>
          <a href="#community" className="app-nav-link">Community</a>
          <button
            onClick={onToggleTheme}
            className={styles.themeToggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </Container>
    </header>
  );
};