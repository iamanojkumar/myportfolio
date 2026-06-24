import styles from './AdminSidebar.module.css';
import { Project } from '../lib/projects';

export function AdminSidebar({
  projects,
  currentId,
  onSelect,
  onNew,
}: {
  projects: Project[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.label}>Projects</div>
      <div className={styles.list}>
        {projects.map((project) => (
          <button
            type="button"
            key={project.id}
            className={`${styles.projectItem} ${project.id === currentId ? styles.active : ''}`}
            onClick={() => onSelect(project.id)}
          >
            <div className={styles.projectTitle}>{project.title || 'Untitled'}</div>
            <div className={styles.projectSub}>{project.sub || '—'}</div>
          </button>
        ))}
      </div>
      <button type="button" className={`${styles.button} btn btn-primary btn-sm`} onClick={onNew}>
        + New project
      </button>
    </aside>
  );
}
