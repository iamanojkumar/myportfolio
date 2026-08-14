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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.icon}
            src="https://mellon.design/wp-content/uploads/2026/04/mellon-design-logo.svg"
            alt="Mellon Design System logo"
            width={48}
            height={48}
          />
        </div>
        <div className={styles.body}>
          <h2 className={styles.title}>
            Mellon — an AI-native, enterprise-ready design system
          </h2>
          <p className={styles.desc}>
            A self-driven initiative to design and ship a scalable, accessible,
            WCAG-aligned component library with AI built into every component —
            in-context summarization and smart actions. Mellon covers design
            tokens, governance, documentation and Figma-to-code parity, so
            product, design and engineering teams ship consistent interfaces
            faster and cut design debt at scale.
          </p>
          <ul className={styles.tags}>
            <li>Design systems</li>
            <li>AI/UX</li>
            <li>Accessibility</li>
            <li>Design tokens</li>
            <li>Figma to code</li>
          </ul>
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
