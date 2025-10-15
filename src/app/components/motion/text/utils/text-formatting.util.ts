export interface ItalicTextResult {
  processed: string;
  hasItalic: boolean;
}

export function processItalicText(text: string): ItalicTextResult {
  const hasItalic = text.includes('*');
  const processed = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  return {
    processed,
    hasItalic
  };
}

export function isItalic(text: string): boolean {
  return text.includes('*');
}