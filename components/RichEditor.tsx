'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './RichEditor.module.css';
import { MediaPopover } from './MediaPopover';
import { uploadMediaFile } from '../lib/uploadMedia';

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
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [activePopover, setActivePopover] = useState<'image' | 'video' | null>(null);

  useEffect(() => {
    if (!activePopover) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePopover]);

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

  const insertHtmlAtSelection = (html: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('insertHTML', false, html);
    updateValue();
  };

  const insertImageSrc = (src: string) => {
    insertHtmlAtSelection(
      `<img src="${src}" alt="" loading="lazy" style="max-width:100%;border-radius:4px;margin:12px 0;display:block" />`
    );
  };

  const insertVideoSrc = (src: string, type?: string) => {
    insertHtmlAtSelection(
      `<video controls style="max-width:100%;border-radius:4px;margin:12px 0;display:block"><source src="${src}"${
        type ? ` type="${type}"` : ''
      } />Your browser does not support the video tag.</video>`
    );
  };

  const handleImageUpload = async (file: File) => {
    const extension = getExtension(file.name);
    if (!IMAGE_TYPES[extension]) {
      throw new Error(`Unsupported image format ".${extension || '?'}". Use one of: ${Object.keys(IMAGE_TYPES).join(', ')}.`);
    }
    const url = await uploadMediaFile(file);
    insertImageSrc(url);
  };

  const handleVideoUpload = async (file: File) => {
    const extension = getExtension(file.name);
    if (!VIDEO_TYPES[extension]) {
      throw new Error(`Unsupported video format ".${extension || '?'}". Use one of: ${Object.keys(VIDEO_TYPES).join(', ')}.`);
    }
    const url = await uploadMediaFile(file);
    insertVideoSrc(url, VIDEO_TYPES[extension]);
  };

  const handleImageLink = (url: string) => insertImageSrc(url);

  const handleVideoLink = (url: string) => {
    const extension = getExtension(url);
    insertVideoSrc(url, VIDEO_TYPES[extension]);
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
      <div className={styles.toolbar} ref={toolbarRef}>
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
        <div className={styles.toolbarItem}>
          <button
            type="button"
            className={styles.button}
            onClick={() => setActivePopover((current) => (current === 'image' ? null : 'image'))}
            title="Insert image"
          >
            🖼
          </button>
          {activePopover === 'image' && (
            <MediaPopover
              accept="image/*"
              label="Insert image"
              onUpload={handleImageUpload}
              onLink={handleImageLink}
              onClose={() => setActivePopover(null)}
            />
          )}
        </div>
        <div className={styles.toolbarItem}>
          <button
            type="button"
            className={styles.button}
            onClick={() => setActivePopover((current) => (current === 'video' ? null : 'video'))}
            title="Insert video"
          >
            🎬
          </button>
          {activePopover === 'video' && (
            <MediaPopover
              accept="video/*"
              label="Insert video"
              onUpload={handleVideoUpload}
              onLink={handleVideoLink}
              onClose={() => setActivePopover(null)}
            />
          )}
        </div>
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
