import Link from 'next/link';
import styles from './FeaturedProjects.module.css';
import { Project } from '../lib/projects';

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>
        <span>Featured</span>
        <span>— {projects.length}</span>
      </div>
      <div className={styles.grid}>
        {projects.map((project) => (
          <Link
            href={`/project/${project.id}`}
            key={project.id}
            className={`${styles.card} reveal`}
          >
            {project.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.cardImage} src={project.heroImage} alt={project.title} />
            ) : (
              <div className={styles.cardImagePlaceholder} />
            )}
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>{project.title || 'Untitled'}</div>
              <div className={styles.cardSub}>{project.sub || ''}</div>
              <span className={styles.cardCta}>
                View project
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
          </Link>
        ))}
      </div>
    </section>
  );
}
