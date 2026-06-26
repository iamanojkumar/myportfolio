'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './TableOfContents.module.css';

export type HeadingItem = {
  id: string;
  level: number;
  text: string;
};

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headings.length) return;

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

  const getIndexFromY = useCallback(
    (clientY: number) => {
      const track = scrubberRef.current;
      if (!track || !headings.length) return 0;

      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

      if (headings.length === 1) return 0;
      return Math.min(headings.length - 1, Math.round(ratio * (headings.length - 1)));
    },
    [headings.length]
  );

  const scrollToHeading = useCallback(
    (index: number, smooth = true) => {
      const heading = headings[index];
      if (!heading) return;

      const target = document.getElementById(heading.id);
      target?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      setActiveId(heading.id);
    },
    [headings]
  );

  const handleScrubberPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    scrubberRef.current?.setPointerCapture(event.pointerId);
    setIsDragging(true);

    const index = getIndexFromY(event.clientY);
    setTooltipIndex(index);
    scrollToHeading(index, false);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      const index = getIndexFromY(event.clientY);
      setTooltipIndex(index);
      scrollToHeading(index, false);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setTooltipIndex(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [getIndexFromY, isDragging, scrollToHeading]);

  if (!headings.length) return null;

  const activeIndex = headings.findIndex((heading) => heading.id === activeId);
  const tooltipHeading = tooltipIndex !== null ? headings[tooltipIndex] : null;
  const tooltipTop =
    tooltipIndex !== null && headings.length > 1
      ? `${(tooltipIndex / (headings.length - 1)) * 100}%`
      : '50%';

  return (
    <aside className={styles.wrapper}>
      <div className={styles.desktop}>
        <div className={styles.label}>Contents</div>
        <ul className={styles.list}>
          {headings.map((heading) => (
            <li className={styles.item} key={heading.id}>
              <button
                type="button"
                className={`${styles.link} ${styles[`indent${heading.level}`]} ${activeId === heading.id ? styles.active : ''}`}
                onClick={() => scrollToHeading(headings.indexOf(heading))}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={scrubberRef}
        className={`${styles.scrubber} ${isDragging ? styles.scrubberDragging : ''}`}
        onPointerDown={handleScrubberPointerDown}
        aria-label="Table of contents"
        role="navigation"
      >
        {headings.map((heading, index) => (
          <span
            key={heading.id}
            className={`${styles.marker} ${styles[`markerLevel${heading.level}`]} ${
              activeIndex === index ? styles.markerActive : ''
            }`}
            aria-hidden="true"
          />
        ))}

        {tooltipHeading && (
          <div
            className={styles.tooltip}
            style={{ ['--tooltip-top' as string]: tooltipTop }}
          >
            {tooltipHeading.text}
          </div>
        )}
      </div>
    </aside>
  );
}
