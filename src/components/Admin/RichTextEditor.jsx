'use client';

import React, { useMemo, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { API_URL } from '@/config/api';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import React-Quill to avoid SSR issues
const ReactQuill = dynamic(
  () => import('react-quill-new'),
  { ssr: false, loading: () => <div className="h-[300px] bg-gray-100 dark:bg-slate-800 animate-pulse rounded-md" /> }
);

// Custom toolbar configuration
const toolbarOptions = [
  // Font and size
  [{ 'header': [1, 2, 3, false] }],
  [{ 'size': ['small', false, 'large', 'huge'] }],

  // Text formatting
  ['bold', 'italic', 'underline', 'strike'],

  // Colors
  [{ 'color': [] }, { 'background': [] }],

  // Lists and alignment
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'align': [] }],

  // Indent
  [{ 'indent': '-1' }, { 'indent': '+1' }],

  // Links, images, video
  ['link', 'image', 'video'],

  // Clean formatting
  ['clean']
];

const formats = [
  'header', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'align', 'indent',
  'link', 'image', 'video'
];

export default function RichTextEditor({ value, onChange, placeholder = "Write your content here...", isDark = false }) {
  const quillRef = useRef(null);

  // Image upload handler
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      // Check both token keys for compatibility
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const formData = new FormData();
      formData.append('images', file);

      try {
        const response = await fetch(`${API_URL}/design-templates/admin/upload-images`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.data?.urls?.[0]) {
          const quill = quillRef.current?.getEditor?.() || quillRef.current;
          if (quill) {
            const range = quill.getSelection?.(true) || { index: 0 };
            quill.insertEmbed?.(range.index, 'image', result.data.urls[0]);
            quill.setSelection?.(range.index + 1);
          }
        } else {
          alert('Failed to upload image');
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Image upload failed');
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: toolbarOptions,
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  return (
    <div className={`rich-editor-wrapper ${isDark ? 'dark-editor' : 'light-editor'}`}>
      <style jsx global>{`
        .rich-editor-wrapper .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-color: ${isDark ? '#334155' : '#e5e7eb'};
          background: ${isDark ? '#1e293b' : '#f9fafb'};
        }
        
        .rich-editor-wrapper .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border-color: ${isDark ? '#334155' : '#e5e7eb'};
          background: ${isDark ? '#0f172a' : '#ffffff'};
          min-height: 300px;
          font-size: 14px;
        }
        
        .rich-editor-wrapper .ql-editor {
          min-height: 280px;
          color: ${isDark ? '#e2e8f0' : '#1f2937'};
        }
        
        .rich-editor-wrapper .ql-editor.ql-blank::before {
          color: ${isDark ? '#64748b' : '#9ca3af'};
          font-style: normal;
        }
        
        .rich-editor-wrapper .ql-stroke {
          stroke: ${isDark ? '#94a3b8' : '#6b7280'};
        }
        
        .rich-editor-wrapper .ql-fill {
          fill: ${isDark ? '#94a3b8' : '#6b7280'};
        }
        
        .rich-editor-wrapper .ql-picker-label {
          color: ${isDark ? '#94a3b8' : '#6b7280'};
        }
        
        .rich-editor-wrapper .ql-picker-options {
          background: ${isDark ? '#1e293b' : '#ffffff'};
          border-color: ${isDark ? '#334155' : '#e5e7eb'};
        }
        
        .rich-editor-wrapper .ql-picker-item {
          color: ${isDark ? '#e2e8f0' : '#1f2937'};
        }
        
        .rich-editor-wrapper .ql-toolbar button:hover,
        .rich-editor-wrapper .ql-toolbar button:focus,
        .rich-editor-wrapper .ql-toolbar button.ql-active {
          background: ${isDark ? '#334155' : '#e5e7eb'};
          border-radius: 4px;
        }
        
        .rich-editor-wrapper .ql-toolbar button:hover .ql-stroke,
        .rich-editor-wrapper .ql-toolbar button:focus .ql-stroke,
        .rich-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: ${isDark ? '#60a5fa' : '#3b82f6'};
        }
        
        .rich-editor-wrapper .ql-toolbar button:hover .ql-fill,
        .rich-editor-wrapper .ql-toolbar button:focus .ql-fill,
        .rich-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: ${isDark ? '#60a5fa' : '#3b82f6'};
        }

        .rich-editor-wrapper .ql-editor ul,
        .rich-editor-wrapper .ql-editor ol {
          padding-left: 1.5em;
        }

        .rich-editor-wrapper .ql-editor li {
          margin-bottom: 0.25em;
        }
      `}</style>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
