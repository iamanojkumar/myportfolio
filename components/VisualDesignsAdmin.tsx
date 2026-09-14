'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './VisualDesignsAdmin.module.css';
import {
  VisualDesign,
  getAllVisualDesigns,
  saveVisualDesign,
  deleteVisualDesign,
} from '../lib/visualDesigns';
import { uploadMediaFile } from '../lib/uploadMedia';

export function VisualDesignsAdmin() {
  const [designs, setDesigns] = useState<VisualDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingNew, setUploadingNew] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllVisualDesigns()
      .then(setDesigns)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddFile = async (file: File) => {
    setUploadingNew(true);
    setError('');
    try {
      const imageUrl = await uploadMediaFile(file);
      const nextSortOrder =
        designs.length > 0 ? Math.max(...designs.map((design) => design.sortOrder)) + 1 : 0;
      const newDesign: VisualDesign = {
        id: crypto.randomUUID(),
        title: '',
        imageUrl,
        sortOrder: nextSortOrder,
        createdAt: new Date().toISOString(),
      };
      const saved = await saveVisualDesign(newDesign);
      setDesigns((current) => [...current, saved]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadingNew(false);
    }
  };

  const handleTitleBlur = async (design: VisualDesign, title: string) => {
    if (title === (design.title || '')) return;
    const updated = { ...design, title: title || null };
    setDesigns((current) => current.map((item) => (item.id === design.id ? updated : item)));
    try {
      await saveVisualDesign(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    }
  };

  const handleDelete = async (design: VisualDesign) => {
    if (!window.confirm('Delete this design? This cannot be undone.')) return;
    try {
      await deleteVisualDesign(design.id);
      setDesigns((current) => current.filter((item) => item.id !== design.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete.');
    }
  };

  const handleMove = async (design: VisualDesign, direction: -1 | 1) => {
    const sorted = [...designs].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = sorted.findIndex((item) => item.id === design.id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const other = sorted[swapIndex];
    const updatedDesign = { ...design, sortOrder: other.sortOrder };
    const updatedOther = { ...other, sortOrder: design.sortOrder };

    setDesigns((current) =>
      current.map((item) => {
        if (item.id === updatedDesign.id) return updatedDesign;
        if (item.id === updatedOther.id) return updatedOther;
        return item;
      })
    );

    try {
      await Promise.all([saveVisualDesign(updatedDesign), saveVisualDesign(updatedOther)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder.');
    }
  };

  if (loading) {
    return <div className={styles.wrapper}>Loading…</div>;
  }

  const sorted = [...designs].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className={styles.wrapper} data-lenis-prevent>
      <p className={styles.intro}>
        The first four designs (by order below) show on the homepage; the rest appear when a
        visitor clicks &ldquo;View more&rdquo;. Use the arrows to reorder.
      </p>

      {error && <div className={styles.emptyState} style={{ color: '#B91C1C', marginBottom: 16 }}>{error}</div>}

      <div className={styles.addRow}>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingNew}
        >
          {uploadingNew ? 'Uploading…' : '+ Add design'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) handleAddFile(file);
          }}
        />
      </div>

      {sorted.length === 0 ? (
        <div className={styles.emptyState}>No visual designs yet. Add one above.</div>
      ) : (
        <div className={styles.grid}>
          {sorted.map((design, index) => (
            <div className={styles.card} key={design.id}>
              <Image
                src={design.imageUrl}
                alt={design.title || 'Visual design'}
                width={600}
                height={450}
                className={styles.cardImage}
                unoptimized
              />
              <div className={styles.cardBody}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Title (optional)"
                  defaultValue={design.title || ''}
                  onBlur={(event) => handleTitleBlur(design, event.target.value)}
                />
                <div className={styles.cardActions}>
                  <div className={styles.orderActions}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleMove(design, -1)}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleMove(design, 1)}
                      disabled={index === sorted.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(design)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
