import { Injectable } from '@angular/core';
import type { AnimationOptions } from 'motion';
import { TransitionOptions, VariantWithTransition } from '../types/motion-animation.types';
import { MotionAnimationService } from './motion-animation.service';
import { getEasing, getRepeatValue, mapRepeatTypeToDirection } from '../utils/easing.utils';

export interface AnimationOptionsConfig {
  targetState?: VariantWithTransition;
  animateState?: VariantWithTransition;
  staggerDelay?: number;
  transition: TransitionOptions | Record<string, TransitionOptions>;
  delay: number;
  easing: string | number[] | { type: 'spring'; stiffness?: number; damping?: number };
  duration: number;
  repeat: boolean;
  onComplete?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class MotionAnimationOptionsService {

  constructor(private motionAnimation: MotionAnimationService) {}

  /**
   * Build animation options from configuration
   * Handles priority: stagger delay > state transition > global transition > defaults
   */
  getAnimationOptions(config: AnimationOptionsConfig): AnimationOptions {
    // Priority: 1. Stagger delay, 2. State-specific transition, 3. Global transition, 4. Individual properties
    const stateTransition = (config.targetState?.transition as TransitionOptions) ??
                           (config.animateState?.transition as TransitionOptions);
    const globalTransition = (config.transition as TransitionOptions);

    const transitionObj: TransitionOptions = stateTransition || globalTransition || {};

    // Always prioritize stagger delay over any other delay settings (including 0)
    const delay = config.staggerDelay !== undefined && config.staggerDelay >= 0
      ? config.staggerDelay
      : (transitionObj.delay ?? config.delay);

    const easeInput = transitionObj.ease ?? config.easing;

    // Detect if target contains keyframe arrays (avoid native spring in that case)
    let targetHasKeyframeArrays = false;
    if (config.targetState) {
      for (const k of Object.keys(config.targetState)) {
        if (k === 'transition' || k === 'at') continue;
        const v: any = config.targetState[k];
        if (Array.isArray(v)) {
          targetHasKeyframeArrays = true;
          break;
        }
      }
    }

    // If spring config and no keyframe arrays, prefer native spring options (no fixed duration)
    if (easeInput && typeof easeInput === 'object' && 'type' in easeInput &&
        easeInput.type === 'spring' && !targetHasKeyframeArrays) {
      const springOptions: any = {
        type: 'spring',
        stiffness: easeInput.stiffness ?? 100,
        damping: easeInput.damping ?? 10,
        delay,
        repeat: getRepeatValue(transitionObj, config.repeat),
        repeatDelay: transitionObj.repeatDelay,
        onComplete: config.onComplete
      };
      const direction = mapRepeatTypeToDirection(transitionObj.repeatType);
      if (direction) springOptions.direction = direction;
      if (transitionObj.repeatType) springOptions.repeatType = transitionObj.repeatType;
      return springOptions as AnimationOptions;
    }

    const ease = getEasing(easeInput, this.motionAnimation);

    const options: any = {
      duration: transitionObj.duration ?? config.duration,
      delay,
      repeat: getRepeatValue(transitionObj, config.repeat),
      repeatDelay: transitionObj.repeatDelay,
      onComplete: config.onComplete
    };

    const direction = mapRepeatTypeToDirection(transitionObj.repeatType);
    if (direction) options.direction = direction;
    if (transitionObj.repeatType) options.repeatType = transitionObj.repeatType;

    options.easing = ease; // Motion 11+
    options.ease = ease; // Back-compat

    return options as AnimationOptions;
  }

  /**
   * Get stagger value from transition configuration
   */
  getStaggerValue(
    animateState?: VariantWithTransition,
    transition?: TransitionOptions | Record<string, TransitionOptions>,
    defaultStaggerChildren: number = 1
  ): number {
    const stateTransition = animateState?.transition as TransitionOptions;
    const globalTransition = transition as TransitionOptions;

    const transitionObj: TransitionOptions = stateTransition || globalTransition || {};

    return transitionObj.staggerChildren ?? defaultStaggerChildren;
  }

  /**
   * Get stagger direction from transition configuration
   */
  getStaggerDirection(
    animateState?: VariantWithTransition,
    transition?: TransitionOptions | Record<string, TransitionOptions>,
    defaultStaggerDirection: number = 1
  ): number {
    const stateTransition = animateState?.transition as TransitionOptions;
    const globalTransition = transition as TransitionOptions;

    const transitionObj: TransitionOptions = stateTransition || globalTransition || {};

    return transitionObj.staggerDirection ?? defaultStaggerDirection;
  }

  /**
   * Get 'when' property from transition configuration
   */
  getWhen(
    animateState?: VariantWithTransition,
    transition?: TransitionOptions | Record<string, TransitionOptions>
  ): 'beforeChildren' | 'afterChildren' | 'together' {
    const stateTransition = animateState?.transition as TransitionOptions;
    const globalTransition = transition as TransitionOptions;

    const transitionObj: TransitionOptions = stateTransition || globalTransition || {};

    return (transitionObj.when ?? 'together') as 'beforeChildren' | 'afterChildren' | 'together';
  }
}
