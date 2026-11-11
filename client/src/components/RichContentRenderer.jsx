import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * Robust, secure Markdown / Rich Content Parser for Softrate Research.
 * Supports:
 * - H2 and H3 extraction with auto-generated slug IDs for the Table of Contents
 * - Syntax-styled Code blocks with Copy button
 * - Markdown tables
 * - Callout Blockquotes
 * - Lists, inline code, bold, links
 */
export function extractHeadings(content = '') {
  const headings = [];
  const lines = content.split('\n');

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const text = trimmed.replace('## ', '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      headings.push({ level: 2, text, id });
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.replace('### ', '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      headings.push({ level: 3, text, id });
    }
  });

  return headings;
}

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        margin: '28px 0',
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          fontSize: '0.78rem',
          color: '#94a3b8',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
        }}
      >
        <span>{language || 'CODE'}</span>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: copied ? '#4ade80' : '#cbd5e1',
            background: 'none',
            fontSize: '0.75rem',
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <pre style={{ margin: 0, padding: '18px', overflowX: 'auto' }}>
        <code style={{ color: '#f8fafc', fontSize: '0.9rem', lineHeight: 1.6 }}>{code}</code>
      </pre>
    </div>
  );
}

export default function RichContentRenderer({ content = '' }) {
  if (!content) return null;

  // Split into blocks by double newlines or code block fences
  const renderElements = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code Block Fence (```)
    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      renderElements.push(
        <CodeBlock
          key={`code-${i}`}
          language={language}
          code={codeLines.join('\n')}
        />
      );
      i++;
      continue;
    }

    // 2. Table (| Col 1 | Col 2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableRows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableRows.push(lines[i].trim());
        i++;
      }

      const headers = tableRows[0]
        .split('|')
        .slice(1, -1)
        .map((h) => h.trim());

      // Filter out divider row (| :--- | :--- |)
      const dataRows = tableRows
        .slice(1)
        .filter((r) => !r.includes('---'))
        .map((r) =>
          r
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim())
        );

      renderElements.push(
        <div key={`table-${i}`} style={{ overflowX: 'auto', margin: '28px 0' }}>
          <table>
            <thead>
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx} dangerouslySetInnerHTML={{ __html: parseInline(h) }} />
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} dangerouslySetInnerHTML={{ __html: parseInline(cell) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // 3. Headings
    if (trimmed.startsWith('## ')) {
      const text = trimmed.replace('## ', '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      renderElements.push(
        <h2 key={`h2-${i}`} id={id}>
          {text}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      const text = trimmed.replace('### ', '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      renderElements.push(
        <h3 key={`h3-${i}`} id={id}>
          {text}
        </h3>
      );
      i++;
      continue;
    }

    // 4. Blockquote
    if (trimmed.startsWith('> ')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }
      renderElements.push(
        <blockquote
          key={`quote-${i}`}
          dangerouslySetInnerHTML={{ __html: parseInline(quoteLines.join(' ')) }}
        />
      );
      continue;
    }

    // 5. Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      renderElements.push(
        <hr key={`hr-${i}`} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '36px 0' }} />
      );
      i++;
      continue;
    }

    // 6. Unordered List Items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const listItems = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))
      ) {
        listItems.push(lines[i].trim().replace(/^[-*]\s*/, ''));
        i++;
      }
      renderElements.push(
        <ul key={`ul-${i}`}>
          {listItems.map((li, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInline(li) }} />
          ))}
        </ul>
      );
      continue;
    }

    // 7. Ordered List Items
    if (/^\d+\.\s/.test(trimmed)) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s*/, ''));
        i++;
      }
      renderElements.push(
        <ol key={`ol-${i}`}>
          {listItems.map((li, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInline(li) }} />
          ))}
        </ol>
      );
      continue;
    }

    // 8. Normal Paragraphs
    if (trimmed.length > 0) {
      renderElements.push(
        <p key={`p-${i}`} dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
      );
    }

    i++;
  }

  return <div className="post-content-body">{renderElements}</div>;
}

// Inline formatting helper
function parseInline(text = '') {
  let parsed = text
    // Escaping angle brackets
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Links [text](url)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #e42525; text-decoration: underline;">$1</a>'
    );

  return parsed;
}

