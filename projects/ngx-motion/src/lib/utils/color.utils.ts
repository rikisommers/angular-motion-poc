import { COLOR_PROPERTIES } from '../constants/motion-defaults.constants';

/**
 * Check if a property is a color property
 */
export function isColorProperty(key: string): boolean {
  return COLOR_PROPERTIES.includes(key as any);
}

/**
 * Normalize color values to a consistent format
 * Converts named colors to hex values for consistent animation
 */
export function normalizeColor(color: any): string {
  if (color == null) return '';

  if (typeof color !== 'string') {
    try {
      return String(color);
    } catch {
      return '';
    }
  }

  // Already normalized formats
  if (color.startsWith('rgb') || color.startsWith('#')) {
    return color;
  }

  // Named color mappings
  const colorMap: Record<string, string> = {
    aqua: '#00ffff',
    red: '#ff0000',
    blue: '#0000ff',
    green: '#008000',
    yellow: '#ffff00',
    purple: '#800080',
    orange: '#ffa500',
    black: '#000000',
    white: '#ffffff',
  };

  return colorMap[color] || color;
}

/**
 * Normalize color values in an array or single value
 */
export function normalizeColorValue(value: any): any {
  if (Array.isArray(value)) {
    return value.map(v => normalizeColor(v));
  }
  return normalizeColor(value);
}
