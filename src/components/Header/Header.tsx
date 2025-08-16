import React from 'react';
import { NorthLabLockup } from '../NorthLabLockup';
import { Container } from '../Container/Container';
import styles from './Header.module.scss';

interface HeaderProps {
  isLoaded: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isLoaded }) => {
  return (
    <header className={`${styles.header} ${isLoaded ? styles.loaded : ''}`} role="banner">
      <Container className={styles.headerContent}>
        <NorthLabLockup className={styles.logo} ariaLabel="NorthLab" />
        <nav className={styles.nav} aria-label="Main navigation">
          <a href="#about" className="app-nav-link">About</a>
          <a href="#roadmap" className="app-nav-link">Roadmap</a>
          <a href="#faq" className="app-nav-link">FAQ</a>
          <a href="#community" className="app-nav-link">Community</a>
        </nav>
      </Container>
    </header>
  );
};