/*
 * Public API Surface of @rs-components/ng-motion
 */

// Export all directives
export { MotionOneDirective } from './src/app/directives/motion-one.directive';
export { MotionIfDirective } from './src/app/directives/motion-if.directive';

// Export interfaces and types
export type{
  TransitionOptions,
  VariantWithTransition,
  TimelineStep
} from './src/app/directives/motion-one.directive';

// Export services
export { MotionOneService } from './src/app/services/motion-one.service';
export { MotionAnimationService } from './src/app/services/motion-animation.service';
