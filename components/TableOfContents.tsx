'use client';

import { useEffect, useState } from 'react';
import styles from './TableOfContents.module.css';

export type HeadingItem = {
  id: string;
  level: number;
  text: string;
};

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!headings.length) return;
    const links = document.querySelectorAll(`.${styles.link}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <aside className={styles.wrapper}>
      <div className={styles.label}>Contents</div>
      <ul className={styles.list}>
        {headings.map((heading) => (
          <li className={styles.item} key={heading.id}>
            <button
              type="button"
              className={`${styles.link} ${styles[`indent${heading.level}`]} ${activeId === heading.id ? styles.active : ''}`}
              onClick={() => {
                const target = document.getElementById(heading.id);
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
