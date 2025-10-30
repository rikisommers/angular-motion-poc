import { TransitionOptions } from '../types/motion-animation.types';
import { MotionAnimationService } from '../services/motion-animation.service';

/**
 * Resolve easing string/config to Motion One easing function
 */
export function getEasing(
  easingString: string | number[] | { type: 'spring'; stiffness?: number; damping?: number } | undefined,
  motionAnimation: MotionAnimationService
): any {
  if (!easingString) return motionAnimation.easeInOut;

  // Array easing (cubic bezier)
  if (Array.isArray(easingString)) {
    return easingString;
  }

  // Spring configuration
  if (typeof easingString === 'object' && 'type' in easingString && easingString.type === 'spring') {
    return motionAnimation.spring({
      stiffness: easingString.stiffness || 100,
      damping: easingString.damping || 10
    });
  }

  // Named easing strings
  if (typeof easingString === 'string') {
    if (easingString === 'ease-in') return motionAnimation.easeIn;
    if (easingString === 'ease-out') return motionAnimation.easeOut;
    if (easingString === 'ease-in-out' || easingString === 'ease') return motionAnimation.easeInOut;
    if (easingString === 'spring') return motionAnimation.spring();
  }

  return motionAnimation.easeInOut;
}

/**
 * Map Framer Motion repeatType to Motion One direction
 */
export function mapRepeatTypeToDirection(
  repeatType: TransitionOptions['repeatType'] | undefined
): 'normal' | 'reverse' | 'alternate' | undefined {
  if (!repeatType) return undefined;

  // Aliases
  if (repeatType === 'forwards' || repeatType === 'loop') return 'normal';
  if (repeatType === 'reverse') return 'reverse';
  if (repeatType === 'pingPong' || repeatType === 'mirror') return 'alternate';

  // Default
  return 'normal';
}

/**
 * Normalize repeat value (convert boolean/number to number)
 */
export function normalizeRepeatValue(repeat: number | boolean | undefined): number {
  if (repeat === undefined) return 0;
  if (repeat === true) return Infinity;
  if (typeof repeat === 'number') return repeat;
  return 0;
}

/**
 * Get repeat value from transition object or fallback
 */
export function getRepeatValue(transitionObj: TransitionOptions, fallbackRepeat: boolean): number {
  if (transitionObj.repeat !== undefined) {
    if (transitionObj.repeat === true) {
      return Infinity;
    } else if (typeof transitionObj.repeat === 'number') {
      return transitionObj.repeat;
    }
  }

  return fallbackRepeat ? Infinity : 0;
}
