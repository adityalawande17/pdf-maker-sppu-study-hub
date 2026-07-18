import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import Placeholder from '@tiptap/extension-placeholder';
import Toolbar from './Toolbar';
import Spinner from './Spinner';
import { generatePdf, clearToken } from '../api';

const SLOW_HINT_DELAY = 4000;

export default function Editor({ token, onAuthError }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [generating, setGenerating] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState('');
  const slowTimer = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: 'Start writing your note…' }),
    ],
    content: '',
  });

  async function handleGenerate() {
    if (!editor) return;
    setError('');
    setGenerating(true);
    setSlow(false);
    slowTimer.current = setTimeout(() => setSlow(true), SLOW_HINT_DELAY);

    try {
      const contentHtml = editor.getHTML();
      const { blob, filename } = await generatePdf(token, { title, subject, contentHtml });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      if (err.isAuthError) {
        clearToken();
        onAuthError();
      } else {
        setError(err.message);
      }
    } finally {
      clearTimeout(slowTimer.current);
      setGenerating(false);
      setSlow(false);
    }
  }

  return (
    <div className="editor-screen">
      <header className="editor-header">
        <h1>PDF Maker</h1>
        <button className="generate-btn" onClick={handleGenerate} disabled={generating}>
          {generating && <Spinner />}
          {generating ? 'Generating…' : 'Generate PDF'}
        </button>
      </header>

      {error && <div className="error-message editor-error">{error}</div>}
      {generating && slow && (
        <div className="slow-hint">
          Waking up the server — this can take up to a minute if it's been idle.
        </div>
      )}

      <div className="meta-row">
        <input
          className="title-input"
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="subject-input"
          type="text"
          placeholder="Subject (e.g. Data Structures)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="editor-card">
        <Toolbar editor={editor} />
        <EditorContent className="editor-content" editor={editor} />
      </div>
    </div>
  );
}
