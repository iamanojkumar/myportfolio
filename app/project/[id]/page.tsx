import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllProjects, getProjectById, generateHeadingData } from '../../../lib/projects';
import { TableOfContents } from '../../../components/TableOfContents';
import { RevealContainer } from '../../../components/RevealContainer';
import styles from './page.module.css';

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ id: project.id }));
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = getProjectById(params.id);

  if (!project) {
    notFound();
  }

  const { content, headings } = generateHeadingData(project.content);

  return (
    <main className={styles.page} id="page-project">
      <RevealContainer>
        <div className={styles.projectLayout}>
          <TableOfContents headings={headings} />
          <article className={`${styles.projectBodyWrap} reveal`}>
            <a href="/" className={`${styles.projectBack} reveal`}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </a>
            <div className={`${styles.projectHeaderTag} reveal`}>Project</div>
            <h1 className={`${styles.projectMainTitle} reveal`}>{project.title}</h1>
            <p className={`${styles.projectMainSub} reveal`}>{project.sub || ''}</p>
            {project.heroImage ? (
              <img className={`${styles.projectHeroImg} reveal`} src={project.heroImage} alt={project.title} />
            ) : (
              <div className={`${styles.projectHeroImgPlaceholder} reveal`}>No cover image</div>
            )}
            <div className={`${styles.projectContent} reveal`} dangerouslySetInnerHTML={{ __html: content }} />
          </article>
        </div>
      </RevealContainer>
    </main>
  );
}
