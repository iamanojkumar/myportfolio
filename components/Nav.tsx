'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Nav.module.css';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.logo}>
        Portfolio
      </Link>
      <div className={styles.right}>
        <Link href="/" className={styles.link}>
          Work
        </Link>
        <Link href="/admin" className={styles.link}>
          Admin
        </Link>
      </div>
    </nav>
  );
}
