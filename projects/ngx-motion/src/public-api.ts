/*
 * Public API Surface of ngx-motion
 */

// Motion One specific exports
export * from './lib/directives/motion-one.directive';
export * from './lib/directives/motion-if.directive';
export * from './lib/services/motion-one.service';
export * from './lib/services/motion-animation.service';

// Export interfaces and types
export type {
  TransitionOptions,
  VariantWithTransition,
  TimelineStep
} from './lib/directives/motion-one.directive';

export type {
  MotionElement
} from './lib/services/motion-one.service';