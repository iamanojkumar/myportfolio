import projects from '../data/projects.json';

export type Project = {
  id: string;
  title: string;
  sub: string | null;
  heroImage: string | null;
  content: string;
  createdAt: string;
};

export const getAllProjects = (): Project[] => projects as Project[];

export const getProjectById = (id: string): Project | undefined =>
  getAllProjects().find((project) => project.id === id);

export const generateHeadingData = (html: string) => {
  const headings: Array<{ id: string; level: number; text: string }> = [];
  let counter = 0;
  const content = html.replace(/<(h[1-5])>(.*?)<\/\1>/gi, (_match, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim() || 'section';
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const id = `${slug || 'section'}-${counter++}`;
    headings.push({ id, level: Number(tag[1]), text });
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
  return { content, headings };
};
