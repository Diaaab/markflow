import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { 
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Terminal, Minus, 
  Link2, Image as ImageIcon, Youtube as YoutubeIcon, Undo2, Redo2 
} from 'lucide-react';

interface WYSIWYGEditorProps {
  htmlContent: string;
  onChange: (html: string) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({
  htmlContent,
  onChange,
  scrollRef,
  onScroll
}) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);

  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'wysiwyg-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'wysiwyg-image',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'wysiwyg-youtube',
        },
      }),
    ],
    content: htmlContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync content from Markdown editor
  useEffect(() => {
    if (editor && htmlContent !== editor.getHTML()) {
      // We pass true to keep the current cursor position if possible
      editor.commands.setContent(htmlContent, false);
    }
  }, [htmlContent, editor]);

  if (!editor) {
    return null;
  }

  // Action helper methods
  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setIsLinkModalOpen(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setIsImageModalOpen(false);
    }
  };

  const addYoutubeVideo = () => {
    if (youtubeUrl) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
      setYoutubeUrl('');
      setIsYoutubeModalOpen(false);
    }
  };

  return (
    <div className="pane-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar Area */}
      <div className="wysiwyg-toolbar">
        {/* Undo/Redo */}
        <div className="toolbar-group">
          <button 
            type="button"
            className="btn btn-icon" 
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button 
            type="button"
            className="btn btn-icon" 
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <div className="toolbar-separator" />

        {/* Headings */}
        <div className="toolbar-group">
          <button 
            type="button"
            className={`btn btn-icon ${editor.isActive('heading', { level: 1 }) ? 'btn-active' : ''}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button 
            type="button"
            className={`btn btn-icon ${editor.isActive('heading', { level: 2 }) ? 'btn-active' : ''}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>
          <button 
            type="button"
            className={`btn btn-icon ${editor.isActive('heading', { level: 3 }) ? 'btn-active' : ''}`}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Heading 3"
          >
            <Heading3 size={16} />
          </button>
        </div>

        <div className="toolbar-separator" />

        {/* Text Styling */}
        <div className="toolbar-group">
          <button 
            type="button"
            className={`btn btn-icon ${editor.isActive('bold') ? 'btn-active' : ''}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button 
            type="button"
            className={`btn btn-icon ${editor.isActive('italic') ? 'btn-active' : ''}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button 
            type="button"
            className={`btn btn-icon ${editor.isActive('strike') ? 'btn-active' : ''}`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
          <button 
            type="button"
            className={`btn btn-icon ${editor.isActive('code') ? 'btn-active' : ''}`}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Inline Code"
          >
            <Code size={16} />
          </button>
        </div>

        <div className="toolbar-separator" />

        {/* Lists & Blocks */}
        <div className="toolbar-group">
          <button 
            type="button"
            className={`btn btn-icon ${editor.isActive('bulletList') ? 'btn-active' : ''}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button 
            type="button"
            className={`btn btn-icon ${editor.isActive('orderedList') ? 'btn-active' : ''}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered List"
          >
            <ListOrdered size={16} />
          </button>
          <button 
            type="button"
            className={`btn btn-icon ${editor.isActive('blockquote') ? 'btn-active' : ''}`}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
          >
            <Quote size={16} />
          </button>
          <button 
            type="button"
            className={`btn btn-icon ${editor.isActive('codeBlock') ? 'btn-active' : ''}`}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
          >
            <Terminal size={16} />
          </button>
          <button 
            type="button"
            className="btn btn-icon" 
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Line"
          >
            <Minus size={16} />
          </button>
        </div>

        <div className="toolbar-separator" />

        {/* Links & Media Embeds */}
        <div className="toolbar-group">
          <button 
            type="button"
            className={`btn btn-icon ${editor.isActive('link') ? 'btn-active' : ''}`}
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href;
              setLinkUrl(previousUrl || '');
              setIsLinkModalOpen(true);
            }}
            title="Insert Link"
          >
            <Link2 size={16} />
          </button>
          {editor.isActive('link') && (
            <button 
              type="button"
              className="btn btn-icon" 
              onClick={removeLink}
              title="Remove Link"
              style={{ color: '#ef4444' }}
            >
              Unlink
            </button>
          )}
          <button 
            type="button"
            className="btn btn-icon" 
            onClick={() => setIsImageModalOpen(true)}
            title="Insert Image"
          >
            <ImageIcon size={16} />
          </button>
          <button 
            type="button"
            className="btn btn-icon" 
            onClick={() => setIsYoutubeModalOpen(true)}
            title="Embed YouTube Video"
          >
            <YoutubeIcon size={16} />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div 
        ref={scrollRef}
        onScroll={onScroll}
        className="pane-body"
        style={{ flex: 1, overflowY: 'auto' }}
      >
        <EditorContent editor={editor} style={{ height: '100%' }} />
      </div>

      {/* Link Dialog Modal */}
      {isLinkModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLinkModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Insert / Edit Link</div>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Link URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://example.com" 
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addLink()}
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setIsLinkModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={addLink}>Insert Link</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog Modal */}
      {isImageModalOpen && (
        <div className="modal-overlay" onClick={() => setIsImageModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Insert Image</div>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Image Source URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://images.unsplash.com/..." 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addImage()}
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setIsImageModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={addImage}>Insert Image</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Dialog Modal */}
      {isYoutubeModalOpen && (
        <div className="modal-overlay" onClick={() => setIsYoutubeModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Embed YouTube Video</div>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">YouTube URL or Video ID</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addYoutubeVideo()}
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setIsYoutubeModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={addYoutubeVideo}>Embed Video</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
