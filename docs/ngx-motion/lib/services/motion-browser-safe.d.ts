/**
 * Browser-safe wrapper for Motion One
 * Prevents "window is not defined" errors during SSR
 */
export declare const animate: (...args: any[]) => any;
export declare const easeIn: any;
export declare const easeOut: any;
export declare const easeInOut: any;
export declare const stagger: (...args: any[]) => any;
export declare const inView: (...args: any[]) => any;
export type { AnimationOptions, Target } from 'motion';
