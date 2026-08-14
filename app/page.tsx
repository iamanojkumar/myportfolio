import { getAllProjects, splitFeatured } from '../lib/projects';
import { ProjectList } from '../components/ProjectList';
import { FeaturedProjects } from '../components/FeaturedProjects';
import { SpotlightBlock } from '../components/SpotlightBlock';
import { RevealContainer } from '../components/RevealContainer';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const projects = await getAllProjects();
  const { featured, rest } = splitFeatured(projects);

  return (
    <main className={styles.page} id="page-home">
      <RevealContainer>
        <div className={styles.container}>
          <section className={`${styles.homeHeader} reveal`}>
            <h1 className={styles.homeTitle}>
              Design & <em>Engineering</em>
            </h1>
            <p className={styles.homeBio}>
              Combining design thinking with technical expertise to create intuitive, scalable digital products. I enjoy taking ideas from research and strategy through UX/UI design to implementation, building experiences that balance user needs, business goals, and engineering feasibility.
            </p>
          </section>

          <SpotlightBlock />

          <FeaturedProjects projects={featured} />

          {rest.length > 0 && (
            <ProjectList
              projects={rest}
              label={featured.length > 0 ? 'All projects' : 'Projects'}
            />
          )}

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
