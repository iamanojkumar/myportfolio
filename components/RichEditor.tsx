'use client';

import { useEffect, useRef } from 'react';
import styles from './RichEditor.module.css';

const sanitizeFilename = (value: string) => value.trim().replace(/^\/+/, '').replace(/\s+/g, '-');

const getVideoType = (filename: string) => {
  if (filename.endsWith('.webm')) return 'video/webm';
  if (filename.endsWith('.ogg')) return 'video/ogg';
  return 'video/mp4';
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
    const filename = sanitizeFilename(window.prompt('Enter image filename (e.g. cover.jpg):') || '');
    if (!filename) return;
    const src = `/images/${filename}`;
    const html = `<img src="${src}" alt="" style="max-width:100%;border-radius:4px;margin:12px 0;display:block" />`;
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('insertHTML', false, html);
    updateValue();
  };

  const insertVideo = () => {
    const filename = sanitizeFilename(window.prompt('Enter video filename (e.g. clip.mp4):') || '');
    if (!filename) return;
    const src = `/images/${filename}`;
    const type = getVideoType(filename);
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
