'use client';

import { useEffect } from 'react';
import styles from './RevealContainer.module.css';

export function RevealContainer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal:not(.in)');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return <div className={styles.wrapper}>{children}</div>;
}
