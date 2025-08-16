import React from 'react';
import { Container } from '../../primitives/Container';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerContent}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} NorthLab — find your North. Build what's yours.
          </p>
          <div className={styles.footerLinks}>
            <a href="#" className="app-nav-link">Privacy</a>
            <a href="#" className="app-nav-link">Contact</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};