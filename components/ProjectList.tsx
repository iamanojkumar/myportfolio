'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './ProjectList.module.css';
import { ALL_TAG, DESIGNERS_PICK, PROJECT_TAGS, Project } from '../lib/projects';

export function ProjectList({
  projects,
  label = 'Projects',
}: {
  projects: Project[];
  label?: string;
}) {
  // Only offer chips that actually match something, so no filter leads to an empty list.
  const tags = useMemo(
    () => PROJECT_TAGS.filter((tag) => projects.some((project) => project.tags.includes(tag))),
    [projects]
  );

  const [activeTag, setActiveTag] = useState<string>(() =>
    tags.includes(DESIGNERS_PICK) ? DESIGNERS_PICK : ALL_TAG
  );

  const visible =
    activeTag === ALL_TAG
      ? projects
      : projects.filter((project) => project.tags.includes(activeTag));

  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>
        <span>{label}</span>
        <span>— {visible.length}</span>
      </div>

      {tags.length > 0 && (
        <div className={styles.filters} role="group" aria-label="Filter projects by tag">
          {[...tags, ALL_TAG].map((tag) => (
            <button
              key={tag}
              type="button"
              className={styles.filterChip}
              aria-pressed={activeTag === tag}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <ul className={styles.projectList}>
        {visible.map((project) => (
          <li className={`${styles.projectItem} reveal`} key={project.id}>
            <Link href={`/project/${project.id}`} className={styles.projectLink}>
              <div className={styles.projectInfo}>
                <div className={styles.projectTitle}>{project.title}</div>
                <div className={styles.projectSub}>{project.sub || ''}</div>
              </div>
              <div className={styles.projectArrow}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 9L9 3M9 3H4M9 3V8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
