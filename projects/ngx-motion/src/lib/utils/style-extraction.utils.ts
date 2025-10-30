import { VariantWithTransition } from '../types/motion-animation.types';
import { EXCLUDED_PROPERTIES } from '../constants/motion-defaults.constants';
import { isTransformProperty, applyTransformProperty, normalizeTransformProperty } from './transform.utils';
import { isColorProperty, normalizeColorValue } from './color.utils';

/**
 * Extract only style properties from a variant (excluding transition and metadata)
 */
export function extractStyleProperties(variant: VariantWithTransition): Record<string, any> {
  if (!variant) return {};

  const result: Record<string, any> = {};

  for (const key in variant) {
    // Skip meta keys
    if (EXCLUDED_PROPERTIES.includes(key as any)) continue;

    // Allow raw transform strings or keyframe arrays to pass through untouched
    if (key === 'transform') {
      result['transform'] = variant[key];
      continue;
    }

    if (isTransformProperty(key)) {
      applyTransformProperty(result, key, variant[key]);
    } else {
      applyStyleProperty(result, key, variant[key]);
    }
  }

  normalizeTransformProperty(result);

  return result;
}

/**
 * Apply a regular style property to the result object
 * Handles color normalization if needed
 */
export function applyStyleProperty(
  result: Record<string, any>,
  key: string,
  value: any
): void {
  if (isColorProperty(key)) {
    result[key] = normalizeColorValue(value);
  } else {
    result[key] = value;
  }
}

/**
 * Check if a variant has any style properties to apply
 */
export function hasStyleProperties(variant: VariantWithTransition): boolean {
  if (!variant || typeof variant !== 'object') return false;

  for (const key in variant) {
    if (!EXCLUDED_PROPERTIES.includes(key as any)) {
      return true;
    }
  }

  return false;
}
