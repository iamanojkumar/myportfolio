import { supabase } from './supabaseClient';

export type VisualDesign = {
  id: string;
  title: string | null;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
};

type VisualDesignRow = {
  id: string;
  title: string | null;
  image_url: string;
  sort_order: number;
  created_at: string;
};

const fromRow = (row: VisualDesignRow): VisualDesign => ({
  id: row.id,
  title: row.title,
  imageUrl: row.image_url,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
});

const toRow = (design: VisualDesign) => ({
  id: design.id,
  title: design.title,
  image_url: design.imageUrl,
  sort_order: design.sortOrder,
});

export const getAllVisualDesigns = async (): Promise<VisualDesign[]> => {
  const { data, error } = await supabase
    .from('visual_designs')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as VisualDesignRow[]).map(fromRow);
};

export const saveVisualDesign = async (design: VisualDesign): Promise<VisualDesign> => {
  const { data, error } = await supabase
    .from('visual_designs')
    .upsert(toRow(design))
    .select()
    .single();

  if (error) throw error;
  return fromRow(data as VisualDesignRow);
};

export const deleteVisualDesign = async (id: string): Promise<void> => {
  const { error } = await supabase.from('visual_designs').delete().eq('id', id);
  if (error) throw error;
};
