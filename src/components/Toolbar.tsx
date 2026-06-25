import React, { useRef } from 'react';
import { 
  Sun, Moon, Trash2, Copy, Check, FileUp, FileDown
} from 'lucide-react';

interface ToolbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  syncScroll: boolean;
  setSyncScroll: (sync: boolean) => void;
  onClear: () => void;
  onCopy: () => void;
  isCopied: boolean;
  onImport: (content: string) => void;
  onExport: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  theme,
  toggleTheme,
  syncScroll,
  setSyncScroll,
  onClear,
  onCopy,
  isCopied,
  onImport,
  onExport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        onImport(result);
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be imported again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="header-bar">
      <div className="brand">
        <div className="brand-logo">MF</div>
        <div>
          <h1 className="brand-title">MarkFlow</h1>
          <div className="brand-subtitle">Astro Editor Suite</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Sync Scroll Toggle */}
        <div className="toggle-container" style={{ marginRight: '8px' }}>
          <span>Sync Scroll</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={syncScroll} 
              onChange={(e) => setSyncScroll(e.target.checked)} 
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* File Actions */}
        <div className="toolbar-group">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".md,.txt" 
            style={{ display: 'none' }} 
          />
          <button 
            type="button" 
            className="btn" 
            onClick={() => fileInputRef.current?.click()}
            title="Import Markdown File"
          >
            <FileUp size={16} />
            <span>Import</span>
          </button>
          <button 
            type="button" 
            className="btn" 
            onClick={onExport}
            title="Export Markdown File"
          >
            <FileDown size={16} />
            <span>Export</span>
          </button>
        </div>

        <div className="toolbar-separator" />

        {/* Workspace Actions */}
        <div className="toolbar-group">
          <button 
            type="button" 
            className="btn" 
            onClick={onClear}
            title="Clear Editor"
            style={{ color: '#ef4444' }}
          >
            <Trash2 size={16} />
            <span>Clear</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onCopy}
            title="Copy Raw Markdown to Clipboard"
            style={{ minWidth: '110px' }}
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
            <span>{isCopied ? 'Copied!' : 'Copy MD'}</span>
          </button>
        </div>

        <div className="toolbar-separator" />

        {/* Theme Toggle */}
        <button 
          type="button" 
          className="btn btn-icon" 
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
};
