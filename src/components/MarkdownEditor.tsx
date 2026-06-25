import React, { useEffect, useRef } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  scrollRef: React.RefObject<HTMLTextAreaElement | null>;
  onScroll: (e: React.UIEvent<HTMLTextAreaElement>) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  scrollRef,
  onScroll
}) => {
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync scroll of line numbers when editor scrolls
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    onScroll(e);
    if (lineNumbersRef.current && scrollRef.current) {
      lineNumbersRef.current.scrollTop = scrollRef.current.scrollTop;
    }
  };

  // Generate line numbers count
  const lines = value.split('\n');
  const lineNumbers = Array.from({ length: Math.max(lines.length, 1) }, (_, i) => i + 1);

  // Sync line numbers scrolling whenever the value updates (in case size changed)
  useEffect(() => {
    if (lineNumbersRef.current && scrollRef.current) {
      lineNumbersRef.current.scrollTop = scrollRef.current.scrollTop;
    }
  }, [value, scrollRef]);

  return (
    <div className="pane-body markdown-editor-wrapper">
      {/* Line Numbers Column */}
      <div 
        ref={lineNumbersRef}
        className="line-numbers"
        style={{ overflowY: 'hidden' }}
      >
        {lineNumbers.map((num) => (
          <div key={num} style={{ height: '22.4px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {num}
          </div>
        ))}
      </div>

      {/* Main Textarea */}
      <textarea
        ref={scrollRef}
        className="raw-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder="# Start writing markdown here..."
        style={{
          lineHeight: '22.4px', // Matches line number height
        }}
      />
    </div>
  );
};
