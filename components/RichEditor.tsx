'use client';

import { useEffect, useRef } from 'react';
import styles from './RichEditor.module.css';

const sanitizeFilename = (value: string) => value.trim().replace(/^\/+/, '').replace(/\s+/g, '-');

const getExtension = (filename: string) => {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : '';
};

const IMAGE_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
};

const VIDEO_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  ogg: 'video/ogg',
  ogv: 'video/ogg',
  mov: 'video/quicktime',
};

export function RichEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) {
      editor.innerHTML = value;
    }
  }, [value]);

  const updateValue = () => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  };

  const execCommand = (cmd: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(cmd, false, value ?? undefined);
    updateValue();
  };

  const insertLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) execCommand('createLink', url);
  };

  const insertImage = () => {
    const filename = sanitizeFilename(
      window.prompt('Enter image/GIF filename (e.g. cover.jpg, cover.gif, cover.webp, cover.avif):') || ''
    );
    if (!filename) return;
    const extension = getExtension(filename);
    if (!IMAGE_TYPES[extension]) {
      window.alert(`Unsupported image format ".${extension}". Use one of: ${Object.keys(IMAGE_TYPES).join(', ')}.`);
      return;
    }
    const src = `/images/${filename}`;
    const html = `<img src="${src}" alt="" loading="lazy" style="max-width:100%;border-radius:4px;margin:12px 0;display:block" />`;
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('insertHTML', false, html);
    updateValue();
  };

  const insertVideo = () => {
    const filename = sanitizeFilename(
      window.prompt('Enter video filename (e.g. clip.mp4, clip.webm, clip.ogg, clip.mov):') || ''
    );
    if (!filename) return;
    const extension = getExtension(filename);
    if (!VIDEO_TYPES[extension]) {
      window.alert(`Unsupported video format ".${extension}". Use one of: ${Object.keys(VIDEO_TYPES).join(', ')}.`);
      return;
    }
    const src = `/images/${filename}`;
    const type = VIDEO_TYPES[extension];
    const html = `<video controls style="max-width:100%;border-radius:4px;margin:12px 0;display:block"><source src="${src}" type="${type}" />Your browser does not support the video tag.</video>`;
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('insertHTML', false, html);
    updateValue();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      if (!editorRef.current) return;
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
      updateValue();
    }
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <button type="button" className={styles.button} onClick={() => execCommand('formatBlock', 'h1')} title="Heading 1">
          H1
        </button>
        <button type="button" className={styles.button} onClick={() => execCommand('formatBlock', 'h2')} title="Heading 2">
          H2
        </button>
        <button type="button" className={styles.button} onClick={() => execCommand('formatBlock', 'h3')} title="Heading 3">
          H3
        </button>
        <button type="button" className={styles.button} onClick={() => execCommand('formatBlock', 'h4')} title="Heading 4">
          H4
        </button>
        <button type="button" className={styles.button} onClick={() => execCommand('formatBlock', 'h5')} title="Heading 5">
          H5
        </button>
        <button type="button" className={styles.button} onClick={() => execCommand('formatBlock', 'p')} title="Paragraph">
          ¶
        </button>
        <div className={styles.separator} />
        <button type="button" className={styles.button} onClick={() => execCommand('bold')} title="Bold">
          B
        </button>
        <button type="button" className={styles.button} onClick={() => execCommand('italic')} title="Italic">
          I
        </button>
        <button type="button" className={styles.button} onClick={() => execCommand('underline')} title="Underline">
          U
        </button>
        <button type="button" className={styles.button} onClick={() => execCommand('strikeThrough')} title="Strikethrough">
          S
        </button>
        <div className={styles.separator} />
        <button type="button" className={styles.button} onClick={() => execCommand('insertUnorderedList')} title="Bullet list">
          •
        </button>
        <button type="button" className={styles.button} onClick={() => execCommand('insertOrderedList')} title="Numbered list">
          1.
        </button>
        <button type="button" className={styles.button} onClick={() => execCommand('formatBlock', 'blockquote')} title="Blockquote">
          &quot;
        </button>
        <div className={styles.separator} />
        <button type="button" className={styles.button} onClick={insertLink} title="Link">
          🔗
        </button>
        <button type="button" className={styles.button} onClick={insertImage} title="Insert image">
          🖼
        </button>
        <button type="button" className={styles.button} onClick={insertVideo} title="Insert video">
          🎬
        </button>
        <div className={styles.separator} />
        <button type="button" className={styles.button} onClick={() => execCommand('removeFormat')} title="Clear format">
          ✕
        </button>
      </div>
      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        onInput={updateValue}
        onKeyDown={handleKeyDown}
        data-placeholder="Start writing your project content…"
        suppressContentEditableWarning
      />
    </div>
  );
}
