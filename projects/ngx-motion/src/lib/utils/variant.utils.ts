import { VariantWithTransition } from '../types/motion-animation.types';

/**
 * Resolve a variant reference to its actual definition
 * Handles both string references and direct object definitions
 */
export function resolveVariant(
  variant: VariantWithTransition | string,
  variants: { [key: string]: VariantWithTransition }
): VariantWithTransition {
  if (typeof variant === 'string') {
    return variants[variant] || {};
  } else if (typeof variant === 'object' && variant !== null) {
    return variant;
  } else {
    return {};
  }
}

/**
 * Extract metadata properties from a variant (properties that aren't styles)
 */
export function extractVariantMetadata(variant: VariantWithTransition): {
  transition?: any;
  at?: number;
} {
  return {
    transition: variant.transition,
    at: variant.at
  };
}

/**
 * Check if a variant has any style properties (excluding metadata)
 */
export function hasStyleProperties(variant: VariantWithTransition): boolean {
  if (!variant || typeof variant !== 'object') return false;

  const keys = Object.keys(variant);
  const styleKeys = keys.filter(key => key !== 'transition' && key !== 'at');

  return styleKeys.length > 0;
}

/**
 * Check if a variant is empty or undefined
 */
export function isEmptyVariant(variant: VariantWithTransition | string | undefined): boolean {
  if (!variant) return true;
  if (typeof variant === 'string') return false; // String references are not empty
  if (typeof variant === 'object') {
    return Object.keys(variant).length === 0;
  }
  return true;
}
