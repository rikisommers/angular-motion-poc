/**
 * Shared type definitions for Motion One animations
 */

/**
 * Transition configuration options similar to Framer Motion
 */
export interface TransitionOptions {
  duration?: number;
  delay?: number;
  ease?: string | number[] | { type: 'spring'; stiffness?: number; damping?: number };
  repeat?: number | boolean;
  repeatType?: 'loop' | 'mirror' | 'reverse' | 'forwards' | 'pingPong';
  repeatDelay?: number;
  staggerChildren?: number;
  staggerDirection?: number;
  when?: 'beforeChildren' | 'afterChildren' | 'together';
  delayChildren?: number;
  times?: number[]; // keyframe times 0..1
}

/**
 * Variant definition that can include transition properties
 */
export interface VariantWithTransition {
  [key: string]: any;
  transition?: TransitionOptions;
  at?: number; // Define when variant should be triggered
}

/**
 * Timeline step for orchestrated per-property animations
 */
export interface TimelineStep {
  prop: string;
  keyframes?: any[] | any;
  to?: any;
  duration: number;
  delay?: number;
  ease?: string | number[] | { type: 'spring'; stiffness?: number; damping?: number };
  atTime?: number; // absolute start (s) relative to element start
  times?: number[];
  repeat?: number | boolean;
  repeatType?: 'loop' | 'mirror' | 'reverse' | 'forwards' | 'pingPong';
  repeatDelay?: number;
}
