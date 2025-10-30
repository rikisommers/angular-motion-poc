/**
 * Default values for Motion One animations
 */

export const MOTION_DEFAULTS = {
  DURATION: 0.3,
  DELAY: 0,
  EXIT_DELAY: 0,
  DELAY_CHILDREN: 0,
  EASING: 'ease',
  OFFSET: '0px',
  STAGGER_CHILDREN: 1,
  STAGGER_DIRECTION: 1,
  REPEAT: false,
  INVIEW_THRESHOLD: 0.1,
  INVIEW_DELAY: 50,
  INVIEW_MARGIN: '0px',
  INVIEW_ROOT_MARGIN: '0px',
  RESET_TIMEOUT: 10,
  STAGGER_TIMEOUT: 50,
} as const;

/**
 * Transform properties that need special handling
 */
export const TRANSFORM_PROPERTIES = ['x', 'y', 'rotate', 'scale', 'scaleX', 'scaleY'] as const;

/**
 * Color properties that need normalization
 */
export const COLOR_PROPERTIES = ['backgroundColor', 'color', 'borderColor'] as const;

/**
 * Properties that should be excluded from style extraction
 */
export const EXCLUDED_PROPERTIES = ['transition', 'at'] as const;

/**
 * Identity matrix for transform operations
 */
export const IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0] as const;
