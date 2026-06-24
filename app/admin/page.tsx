'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { RichEditor } from '../../components/RichEditor';
import styles from './page.module.css';
import type { Project } from '../../lib/projects';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'portfolio2025';

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Project | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    fetch('/data/projects.json')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(() => setProjects([]));
  }, []);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedId) || null,
    [projects, selectedId]
  );

  useEffect(() => {
    setDraft(selectedProject);
  }, [selectedProject]);

  const handleLogin = () => {
    if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
      setLoggedIn(true);
      setError('');
    } else {
      setError('Incorrect credentials. Try again.');
    }
  };

  const handleNew = () => {
    const nextProject: Project = {
      id: `proj-${Date.now()}`,
      title: '',
      sub: '',
      heroImage: null,
      content: '',
      createdAt: new Date().toISOString(),
    };
    const nextProjects = [nextProject, ...projects];
    setProjects(nextProjects);
    setSelectedId(nextProject.id);
    setDraft(nextProject);
  };

  const updateDraft = (patch: Partial<Project>) => {
    setDraft((current) => (current ? { ...current, ...patch } : current));
  };

  const handleSave = () => {
    if (!draft) return;
    const nextProjects = projects.map((project) =>
      project.id === draft.id ? draft : project
    );
    setProjects(nextProjects);
    downloadJson(nextProjects);
  };

  const downloadJson = (data: Project[]) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'projects.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    if (!draft || !window.confirm('Delete this project? This cannot be undone.')) {
      return;
    }
    const nextProjects = projects.filter((project) => project.id !== draft.id);
    setProjects(nextProjects);
    setSelectedId(null);
    setDraft(null);
  };

  const heroFilename = draft?.heroImage ? draft.heroImage.replace(/^\/images\//, '') : '';

  if (!loggedIn) {
    return (
      <main className={styles.page} id="page-admin">
        <div className={styles.adminLogin}>
          <div className={styles.loginCard}>
            <h2 className={styles.loginTitle}>Admin Access</h2>
            <p className={styles.loginSub}>Protected area. Enter your credentials to continue.</p>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="login-user">
                Username
              </label>
              <input
                id="login-user"
                className={styles.formInput}
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin"
                autoComplete="username"
                onKeyDown={(event) => event.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="login-pass">
                Password
              </label>
              <input
                id="login-pass"
                className={styles.formInput}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                onKeyDown={(event) => event.key === 'Enter' && handleLogin()}
              />
            </div>
            <button className="btn btn-primary" type="button" onClick={handleLogin}>
              Sign in
            </button>
            {error && <div className={styles.loginError}>{error}</div>}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page} id="page-admin">
      <div className={styles.adminHeader}>
        <span className={styles.adminTitle}>Admin — Projects</span>
        <div className={styles.adminActions}>
          <a className="btn btn-secondary btn-sm" href="/">
            ← View site
          </a>
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => setLoggedIn(false)}>
            Sign out
          </button>
        </div>
      </div>

      <div className={styles.adminSidebarLayout}>
        <AdminSidebar
          projects={projects}
          currentId={draft?.id || null}
          onSelect={setSelectedId}
          onNew={handleNew}
        />

        <div className={styles.editorSplit}>
          {!draft ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>✦</div>
              <div className={styles.emptyText}>Select a project or create a new one</div>
            </div>
          ) : (
            <>
              <div className={styles.editorPane}>
                <div className={styles.editorPaneHeader}>
                  <span className={styles.editorPaneLabel}>Editor</span>
                  <div className={styles.editorHeaderActions}>
                    <button className="btn btn-danger btn-sm" type="button" onClick={handleDelete}>
                      Delete
                    </button>
                    <button className="btn btn-primary btn-sm" type="button" onClick={handleSave}>
                      Save
                    </button>
                  </div>
                </div>
                <div className={styles.editorBody}>
                  {showBanner && (
                    <div className={styles.infoBanner}>
                      <span>
                        After downloading, replace /data/projects.json in your project, then push to GitHub. Vercel will redeploy automatically.
                      </span>
                      <button type="button" className={styles.dismissButton} onClick={() => setShowBanner(false)}>
                        ×
                      </button>
                    </div>
                  )}

                  <div className={styles.editorField}>
                    <label className={styles.formLabel}>Project Title</label>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Untitled project"
                      value={draft.title}
                      onChange={(event) => updateDraft({ title: event.target.value })}
                    />
                  </div>

                  <div className={styles.editorField}>
                    <label className={styles.formLabel}>Subtext / Tagline</label>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Brief description shown on homepage"
                      value={draft.sub || ''}
                      onChange={(event) => updateDraft({ sub: event.target.value })}
                    />
                  </div>

                  <div className={styles.editorField}>
                    <label className={styles.formLabel}>Cover Image</label>
                    {draft.heroImage ? (
                      <Image
                        src={draft.heroImage}
                        alt="Cover"
                        width={1200}
                        height={675}
                        className="project-img-preview"
                        unoptimized
                      />
                    ) : (
                      <div className="project-img-placeholder">No cover image</div>
                    )}
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="my-cover.jpg"
                      value={heroFilename}
                      onChange={(event) => updateDraft({ heroImage: event.target.value ? `/images/${event.target.value}` : null })}
                    />
                    <p className={styles.helperText}>
                      Drop this file into /public/images/ in your code editor before pushing.
                    </p>
                  </div>

                  <div className={styles.editorField}>
                    <label className={`${styles.formLabel} ${styles.noMargin}`}>
                      Content
                    </label>
                    <div className={styles.spacer6} />
                    <RichEditor value={draft.content} onChange={(next) => updateDraft({ content: next })} />
                    <p className={styles.helperText}>
                      Use the image and video toolbar buttons to insert filenames, not uploads.
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.previewPane}>
                <div className={styles.previewPaneHeader}>
                  <span className={styles.previewPaneLabel}>Preview</span>
                </div>
                <div className={styles.previewBody}>
                  <div className={styles.previewTag}>Project</div>
                  <div className={styles.previewTitle}>{draft.title || '—'}</div>
                  <div className={styles.previewSub}>{draft.sub || '—'}</div>
                  {draft.heroImage ? (
                    <Image
                      src={draft.heroImage}
                      alt="Cover"
                      width={1200}
                      height={675}
                      className={styles.previewHero}
                      unoptimized
                    />
                  ) : null}
                  <div className={styles.previewDivider} />
                  <div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: draft.content }} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
