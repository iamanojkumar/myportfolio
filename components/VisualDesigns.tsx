'use client';

import { useState } from 'react';
import styles from './VisualDesigns.module.css';
import { VisualDesign } from '../lib/visualDesigns';

const PREVIEW_COUNT = 4;

export function VisualDesigns({ designs }: { designs: VisualDesign[] }) {
  const [expanded, setExpanded] = useState(false);

  if (designs.length === 0) return null;

  const visible = expanded ? designs : designs.slice(0, PREVIEW_COUNT);
  const hasMore = designs.length > PREVIEW_COUNT;

  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>
        <span>Visual Design</span>
        <span>— {designs.length}</span>
      </div>
      <div className={styles.grid}>
        {visible.map((design) => (
          <div className={`${styles.card} reveal`} key={design.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.cardImage} src={design.imageUrl} alt={design.title || 'Visual design'} />
            {design.title && <div className={styles.cardTitle}>{design.title}</div>}
          </div>
        ))}
      </div>
      {hasMore && (
        <div className={styles.footer}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? 'Show less' : `View more (${designs.length - PREVIEW_COUNT})`}
          </button>
        </div>
      )}
    </section>
  );
}
