import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from "dompurify";
import { getTextDirection } from "~utils/rtl";

interface MarkdownTextProps {
  text: string;
  isStreaming?: boolean;
  language?: string;
}

const MarkdownText: React.FC<MarkdownTextProps> = ({ 
  text, 
  isStreaming = false,
  language = 'en'
}) => {
  const [formattedText, setFormattedText] = useState('');
  const textDirection = getTextDirection(language);

  useEffect(() => {
    const cleanedText = text
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/>\s+</g, '><')
      .trim();
    
    const markedOptions = {
      breaks: true,
      gfm: true,
      pedantic: false,
      smartypants: true,
      highlight: function(code: string, lang: string) {
        return code;
      }
    };
    let parsed = marked.parse(cleanedText, markedOptions) as string;
    parsed = DOMPurify.sanitize(parsed);
    
    parsed = parsed
      .replace(/<p>/g, '<p class="text-base leading-relaxed mb-4">')
      .replace(/<h1>/g, '<h1 class="text-3xl font-bold mb-6 mt-8">')
      .replace(/<h2>/g, '<h2 class="text-2xl font-semibold mb-4 mt-6">')
      .replace(/<h3>/g, '<h3 class="text-xl font-medium mb-3 mt-5">')
      .replace(/<ul>/g, '<ul class="list-disc pl-6 mb-4 space-y-2">')
      .replace(/<ol>/g, '<ol class="list-decimal pl-6 mb-4 space-y-2">')
      .replace(/<li>/g, '<li class="leading-relaxed">')
      .replace(/<code>/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">')
      .replace(/<pre>/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto">')
      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4">');
    
    setFormattedText(parsed);
  }, [text]);

  return (
    <div 
      className="lu-prose dark:lu-prose-invert lu-max-w-none"
      style={{ 
        direction: textDirection,
        textAlign: textDirection === 'rtl' ? 'right' : 'left'
      }}
      dangerouslySetInnerHTML={{ __html: formattedText }}
    />
  );
};

export default React.memo(MarkdownText);