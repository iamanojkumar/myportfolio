import { getAllProjects } from '../lib/projects';
import { ProjectList } from '../components/ProjectList';
import { RevealContainer } from '../components/RevealContainer';
import styles from './page.module.css';

export default function HomePage() {
  const projects = getAllProjects();

  return (
    <main className={styles.page} id="page-home">
      <RevealContainer>
        <div className={styles.container}>
          <section className={`${styles.homeHeader} reveal`}>
            <div className={styles.homeEyebrow}>Selected Work</div>
            <h1 className={styles.homeTitle}>
              Design & <em>Engineering</em>
              <br />at the boundary
            </h1>
            <p className={styles.homeBio}>
              I build things that feel considered — from digital products to physical systems. Based in the space between rigour and intuition.
            </p>
          </section>

          <ProjectList projects={projects} />

          {projects.length === 0 && (
            <div className={styles.noProjects}>
              No projects yet. <a className={styles.footerLink} href="/admin">Add one in Admin →</a>
            </div>
          )}
        </div>

        <footer className={styles.siteFooter}>
          <span className={styles.footerCopy}>© 2025 Portfolio</span>
          <a className={styles.footerLink} href="/admin">
            Admin
          </a>
        </footer>
      </RevealContainer>
    </main>
  );
}
