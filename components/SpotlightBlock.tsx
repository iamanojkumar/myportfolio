import styles from './SpotlightBlock.module.css';

export function SpotlightBlock() {
  return (
    <section className={`${styles.section} reveal`}>
      <div className={styles.sectionLabel}>
        <span>Currently building</span>
      </div>
      <a
        className={styles.card}
        href="https://mellon-design-system-documentation-ahtu5x8cc.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.iconWrap}>
          <video
            className={styles.icon}
            src="/mellon-loading.webm"
            aria-label="Mellon Design System logo"
            width={48}
            height={48}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
        <div className={styles.body}>
          <h2 className={styles.title}>
            Mellon Design System - AI native, Enterprise ready
          </h2>
          <p className={styles.desc}>
            A self-driven initiative to ship a scalable, WCAG-aligned component
            library with AI in every component. Design tokens, governance and
            Figma-to-code parity help teams ship consistent interfaces faster.
          </p>
          <span className={styles.cta}>
            View documentation
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M3 9L9 3M9 3H4M9 3V8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </a>
    </section>
  );
}
