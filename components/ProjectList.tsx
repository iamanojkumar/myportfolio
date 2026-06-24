import Link from 'next/link';
import styles from './ProjectList.module.css';
import { Project } from '../lib/projects';

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>
        <span>Projects</span>
        <span>— {projects.length}</span>
      </div>
      <ul className={styles.projectList}>
        {projects.map((project) => (
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
