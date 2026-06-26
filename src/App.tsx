import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { Toolbar } from './components/Toolbar';
import { WYSIWYGEditor } from './components/WYSIWYGEditor';
import { MarkdownEditor } from './components/MarkdownEditor';
import { Edit3, Code } from 'lucide-react';

const MARKDOWN_STORAGE_KEY = 'markflow-markdown';

const INITIAL_MARKDOWN = `# Welcome to MarkFlow 🚀

MarkFlow is a premium, split-screen **Markdown WYSIWYG Editor** designed to supercharge your Astro writing workflow. 

Write in the **Rich Text Editor** on the left or edit raw **Markdown** on the right. Both panes sync **bi-directionally** in real-time, with scroll alignment!

## Core Features ⚡

- **Bi-directional Syncing**: Type in either pane; watch the other update instantly.
- **Scroll Syncing**: Keep your eyes focused on the same paragraph across editors.
- **Media Embedding**: Insert images, links, or responsive YouTube videos.
- **Developer Tools**: Single-click clean Markdown copier, text clearance, and theme switching.

---

### Styling Elements 🎨

Here is a blockquote describing editing simplicity:

> "Writing Markdown shouldn't feel like wrestling with brackets. Rich visual editing combined with raw power makes writing articles and content for Astro websites a breeze."

We also support code blocks (with syntax highlights in your site):

\`\`\`javascript
// Quick test snippet
function greetUser(name) {
  console.log(\`Welcome to MarkFlow, \${name}!\`);
}
greetUser('Developer');
\`\`\`

And standard task checklists:
- [x] Initial design completed
- [x] Bi-directional markdown parsing
- [ ] Deploy to production hosting

Let's test an image:
![Workspace mockup](https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80)

Or a YouTube video embed:
<iframe width="640" height="360" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
`;

// Initialize Turndown Service
const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced'
});

// Configure Turndown rules
turndownService.keep(['iframe']);

// Custom rule for task checkboxes
turndownService.addRule('taskList', {
  filter: (node) => {
    return node.nodeName === 'INPUT' && node.getAttribute('type') === 'checkbox';
  },
  replacement: (_, node) => {
    const isChecked = (node as HTMLInputElement).checked;
    return isChecked ? '[x] ' : '[ ] ';
  }
});

// Custom rule for list items in a task list
turndownService.addRule('taskListItem', {
  filter: (node) => {
    return node.nodeName === 'LI' && node.parentElement?.getAttribute('data-type') === 'taskList';
  },
  replacement: (content, node) => {
    const checkbox = node.querySelector('input[type="checkbox"]');
    const isChecked = checkbox ? (checkbox as HTMLInputElement).checked || checkbox.hasAttribute('checked') : false;
    const checkPart = isChecked ? '[x] ' : '[ ] ';
    
    // Clean text of the checkboxes
    const text = content.replace('[x]', '').replace('[ ]', '').replace('[x] ', '').replace('[ ] ', '').trim();
    return `- ${checkPart}${text}\n`;
  }
});

const getInitialMarkdown = () => {
  const savedMarkdown = localStorage.getItem(MARKDOWN_STORAGE_KEY);
  return savedMarkdown ?? INITIAL_MARKDOWN;
};

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(() => getInitialMarkdown());
  const [html, setHtml] = useState<string>(() =>
    marked.parse(getInitialMarkdown(), { async: false }) as string
  );
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  const [syncScroll, setSyncScroll] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Scroll sync references
  const wysiwygScrollRef = useRef<HTMLDivElement>(null);
  const markdownScrollRef = useRef<HTMLTextAreaElement>(null);
  const scrollingSourceRef = useRef<'wysiwyg' | 'markdown' | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Synchronize theme on load & change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persist editor content so reloads restore the latest work.
  useEffect(() => {
    localStorage.setItem(MARKDOWN_STORAGE_KEY, markdown);
  }, [markdown]);

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Bi-directional change handlers
  const handleHtmlChange = (newHtml: string) => {
    setHtml(newHtml);
    // Convert HTML back to markdown
    const md = turndownService.turndown(newHtml);
    setMarkdown(md);
  };

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
    // Convert markdown to HTML
    const parsedHtml = marked.parse(newMarkdown, { async: false }) as string;
    setHtml(parsedHtml);
  };

  // Scroll synchronization handlers
  const handleWysiwygScroll = () => {
    if (!syncScroll || !wysiwygScrollRef.current || !markdownScrollRef.current) return;

    if (scrollingSourceRef.current === null) {
      scrollingSourceRef.current = 'wysiwyg';
    }

    if (scrollingSourceRef.current === 'wysiwyg') {
      const el = wysiwygScrollRef.current;
      const target = markdownScrollRef.current;
      const percentage = el.scrollTop / (el.scrollHeight - el.clientHeight);
      
      // Calculate target scrollTop based on percentage
      target.scrollTop = percentage * (target.scrollHeight - target.clientHeight);

      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        scrollingSourceRef.current = null;
      }, 80);
    }
  };

  const handleMarkdownScroll = () => {
    if (!syncScroll || !wysiwygScrollRef.current || !markdownScrollRef.current) return;

    if (scrollingSourceRef.current === null) {
      scrollingSourceRef.current = 'markdown';
    }

    if (scrollingSourceRef.current === 'markdown') {
      const el = markdownScrollRef.current;
      const target = wysiwygScrollRef.current;
      const percentage = el.scrollTop / (el.scrollHeight - el.clientHeight);
      
      // Calculate target scrollTop based on percentage
      target.scrollTop = percentage * (target.scrollHeight - target.clientHeight);

      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        scrollingSourceRef.current = null;
      }, 80);
    }
  };

  // Top toolbar actions
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all contents?')) {
      setMarkdown('');
      setHtml('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleImport = (content: string) => {
    setMarkdown(content);
    const parsedHtml = marked.parse(content, { async: false }) as string;
    setHtml(parsedHtml);
  };

  const handleExport = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'markflow_export.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate statistics
  const wordCount = markdown.trim() === '' ? 0 : markdown.trim().split(/\s+/).length;
  const charCount = markdown.length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="app-container">
      {/* Upper Main Toolbar */}
      <Toolbar 
        theme={theme}
        toggleTheme={toggleTheme}
        syncScroll={syncScroll}
        setSyncScroll={setSyncScroll}
        onClear={handleClear}
        onCopy={handleCopy}
        isCopied={isCopied}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Main Dual Editor Panels */}
      <main className="split-workspace">
        {/* Left Pane - WYSIWYG Editor */}
        <section className="pane pane-left">
          <div className="pane-header">
            <div className="pane-title">
              <Edit3 size={14} />
              <span>Rich Text Preview / WYSIWYG</span>
            </div>
          </div>
          <WYSIWYGEditor 
            htmlContent={html}
            onChange={handleHtmlChange}
            scrollRef={wysiwygScrollRef}
            onScroll={handleWysiwygScroll}
          />
        </section>

        {/* Right Pane - Raw Markdown Editor */}
        <section className="pane">
          <div className="pane-header">
            <div className="pane-title">
              <Code size={14} />
              <span>Raw Markdown Editor</span>
            </div>
          </div>
          <MarkdownEditor 
            value={markdown}
            onChange={handleMarkdownChange}
            scrollRef={markdownScrollRef}
            onScroll={handleMarkdownScroll}
          />
        </section>
      </main>

      {/* Footer Info stats */}
      <footer className="editor-footer">
        <div>
          <span>MarkFlow Editor v1.0.0</span>
        </div>
        <div className="stats-group">
          <span>Words: <strong>{wordCount}</strong></span>
          <span>Characters: <strong>{charCount}</strong></span>
          <span>Read Time: ~<strong>{readTime}</strong> min</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
