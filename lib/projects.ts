import { supabase } from './supabaseClient';

/** The tag a project is filtered by on the homepage. Order here is the chip order. */
export const DESIGNERS_PICK = "Designer's pick";

export const PROJECT_TAGS = [
  DESIGNERS_PICK,
  'Mobile App',
  'Product',
  'Web design',
  'Interaction design',
] as const;

/** Pseudo-tag for the "show everything" chip — never stored on a project. */
export const ALL_TAG = 'All';

export type Project = {
  id: string;
  title: string;
  sub: string | null;
  heroImage: string | null;
  content: string;
  featured: boolean;
  tags: string[];
  createdAt: string;
};

type ProjectRow = {
  id: string;
  title: string;
  sub: string | null;
  hero_image: string | null;
  content: string;
  featured: boolean | null;
  tags: string[] | null;
  created_at: string;
};

const fromRow = (row: ProjectRow): Project => ({
  id: row.id,
  title: row.title,
  sub: row.sub,
  heroImage: row.hero_image,
  content: row.content,
  featured: row.featured ?? false,
  tags: row.tags ?? [],
  createdAt: row.created_at,
});

const toRow = (project: Project) => ({
  id: project.id,
  title: project.title,
  sub: project.sub,
  hero_image: project.heroImage,
  content: project.content,
  featured: project.featured,
  tags: project.tags,
});

export const getAllProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as ProjectRow[]).map(fromRow);
};

export const splitFeatured = (projects: Project[]) => ({
  featured: projects.filter((project) => project.featured),
  rest: projects.filter((project) => !project.featured),
});

export const getProjectById = async (id: string): Promise<Project | undefined> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as ProjectRow) : undefined;
};

export const saveProject = async (project: Project): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .upsert(toRow(project))
    .select()
    .single();

  if (error) throw error;
  return fromRow(data as ProjectRow);
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
};

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
