import { supabase } from './supabaseClient';

const BUCKET = 'Media';
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const uploadMediaFile = async (file: File): Promise<string> => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File is too large. Max size is 50MB.');
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};
