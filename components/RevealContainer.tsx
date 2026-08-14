'use client';

import { useEffect, useRef } from 'react';
import styles from './RevealContainer.module.css';

export function RevealContainer({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrapperRef.current;
    if (!root) return;

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

    // Re-observing an element is a no-op, so this is safe to call on every mutation.
    const observeAll = () => {
      root.querySelectorAll('.reveal:not(.in)').forEach((el) => observer.observe(el));
    };

    observeAll();

    // Elements added later (e.g. when a project filter changes) must be picked up too,
    // otherwise they stay at opacity 0 forever.
    const mutations = new MutationObserver(observeAll);
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {children}
    </div>
  );
}
