import { Injectable } from '@angular/core';
import type { Target } from 'motion';
import { TimelineStep, TransitionOptions, VariantWithTransition } from '../types/motion-animation.types';
import { MotionAnimationService } from './motion-animation.service';
import { isColorProperty, normalizeColorValue } from '../utils/color.utils';
import { getEasing, getRepeatValue, mapRepeatTypeToDirection } from '../utils/easing.utils';
import { normalizeTimes } from '../utils/timing.utils';

@Injectable({
  providedIn: 'root'
})
export class MotionTimelineService {

  constructor(private motionAnimation: MotionAnimationService) {}

  /**
   * Execute a timeline with orchestrated per-property animations
   */
  runTimeline(
    element: HTMLElement,
    timeline: TimelineStep[],
    targetState: VariantWithTransition,
    baseDelay: number,
    duration: number,
    easing: any,
    repeat: boolean,
    onComplete?: () => void
  ): { controls: any[]; maxEnd: number } {
    const controls: any[] = [];
    let maxEnd = 0;

    // Also animate any non-timeline props from the target state (e.g., opacity)
    const timelinePropsSet = new Set(timeline.map(s => s.prop));
    const nonTimelineTarget: any = {};

    Object.keys(targetState).forEach(k => {
      if (k === 'transition' || k === 'at') return;
      if (!timelinePropsSet.has(k)) {
        nonTimelineTarget[k] = targetState[k];
      }
    });

    if (Object.keys(nonTimelineTarget).length > 0) {
      const options: any = {
        duration,
        delay: baseDelay,
        easing,
        ease: easing,
        repeat: repeat ? Infinity : 0
      };

      const ctl = this.motionAnimation.animate(element as unknown as Target, nonTimelineTarget, options);
      controls.push(ctl);
      const nonEnd = (options.delay ?? 0) + (options.duration ?? duration);
      if (nonEnd > maxEnd) maxEnd = nonEnd;
    }

    // Execute each timeline step
    timeline.forEach(step => {
      const start = baseDelay + (step.atTime ?? 0) + (step.delay ?? 0);
      const stepDuration = step.duration;
      const value = step.keyframes !== undefined ? step.keyframes : step.to;
      const easeInput = step.ease ?? easing;

      const ease = getEasing(easeInput, this.motionAnimation);
      const options: any = {
        duration: stepDuration,
        delay: start,
        easing: ease,
        ease: ease
      };

      // Apply repeat controls if provided
      if (step.repeat !== undefined) {
        options.repeat = step.repeat === true ? Infinity : step.repeat;
      }
      if (step.repeatDelay !== undefined) {
        options.repeatDelay = step.repeatDelay;
      }

      const dir = mapRepeatTypeToDirection(step.repeatType);
      if (dir) options.direction = dir;
      if (step.repeatType) options.repeatType = step.repeatType;
      if (step.times) options.offset = normalizeTimes(step.times, stepDuration);

      const end = start + stepDuration;
      if (end > maxEnd) maxEnd = end;

      let v = value;
      if (isColorProperty(step.prop)) {
        v = normalizeColorValue(v);
      }

      const target = { [step.prop]: v } as any;
      const control = this.motionAnimation.animate(element as unknown as Target, target, options);
      controls.push(control);
    });

    // Set up completion callback
    if (onComplete) {
      setTimeout(() => onComplete(), maxEnd * 1000);
    }

    return { controls, maxEnd };
  }

  /**
   * Execute per-property animations with different timing for each property
   */
  runPerPropertyAnimations(
    element: HTMLElement,
    targetState: VariantWithTransition,
    baseDelay: number,
    duration: number,
    easing: any,
    repeat: boolean,
    onComplete?: () => void
  ): { controls: any[]; maxEnd: number } {
    const controls: any[] = [];
    const transitionMap = targetState.transition as Record<string, TransitionOptions>;
    const props = Object.keys(targetState).filter(k => k !== 'transition' && k !== 'at');

    let maxEnd = 0;

    props.forEach((prop) => {
      const value = (targetState as any)[prop];
      const conf = (transitionMap?.[prop] || {}) as TransitionOptions;
      const delay = baseDelay + (conf.delay ?? 0);
      const ease = getEasing(conf.ease ?? easing, this.motionAnimation);
      const propDuration = conf.duration ?? duration;

      const options: any = {
        duration: propDuration,
        delay,
        easing: ease,
        ease: ease,
        repeat: conf.repeat !== undefined ? getRepeatValue(conf, repeat) : (repeat ? Infinity : 0),
        repeatDelay: conf.repeatDelay
      };

      const dir = mapRepeatTypeToDirection(conf.repeatType);
      if (dir) options.direction = dir;
      if (conf.repeatType) options.repeatType = conf.repeatType;

      const times = (conf as any).times as number[] | undefined;
      if (times && Array.isArray(times)) {
        options.offset = normalizeTimes(times, propDuration);
      }

      const end = delay + propDuration;
      if (end > maxEnd) maxEnd = end;

      let finalValue = value;
      if (isColorProperty(prop)) {
        finalValue = normalizeColorValue(value);
      }

      const target = { [prop]: finalValue } as any;
      const control = this.motionAnimation.animate(element as unknown as Target, target, options);
      controls.push(control);
    });

    // Set up completion callback
    if (onComplete) {
      setTimeout(() => onComplete(), maxEnd * 1000);
    }

    return { controls, maxEnd };
  }

  /**
   * Check if a transition is a per-property map
   */
  isPerPropertyTransition(transition: any): boolean {
    if (!transition || typeof transition !== 'object') return false;

    // A per-property transition map doesn't have top-level duration/delay/ease
    return transition.duration === undefined &&
           transition.delay === undefined &&
           transition.ease === undefined;
  }
}
