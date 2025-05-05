/**
 * Browser-safe wrapper for Motion One
 * Prevents "window is not defined" errors during SSR
 */

// Create mock implementations for server environment
const mockAnimate = () => ({ stop: () => {} });
const mockEasing = { ease: [0, 0, 1, 1] };
const mockStagger = () => 0;

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Define the exports
let motionExports: any = {
  animate: mockAnimate,
  easeIn: mockEasing,
  easeOut: mockEasing,
  easeInOut: mockEasing,
  stagger: mockStagger
};

// Only try to load motion in browser environment
if (isBrowser) {
  try {
    // Use dynamic import syntax
    import('motion').then(motion => {
      motionExports.animate = motion.animate;
      motionExports.easeIn = motion.easeIn;
      motionExports.easeOut = motion.easeOut;
      motionExports.easeInOut = motion.easeInOut;
      motionExports.stagger = motion.stagger;
    }).catch(e => {
      console.warn('Failed to import motion library, using mock implementations', e);
    });
  } catch (e) {
    console.warn('Failed to import motion library, using mock implementations', e);
  }
}

// Export the implementations (real or mock)
export const animate = (...args: any[]) => {
  return motionExports.animate(...args);
};

export const easeIn = motionExports.easeIn;
export const easeOut = motionExports.easeOut;
export const easeInOut = motionExports.easeInOut;
export const stagger = (...args: any[]) => {
  return motionExports.stagger(...args);
};

// Re-export types
export type { 
  NativeAnimationControls, 
  AnimationOptions, 
  Target 
} from 'motion';