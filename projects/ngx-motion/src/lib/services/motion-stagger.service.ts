import { Injectable } from '@angular/core';
import { TransitionOptions } from '../types/motion-animation.types';
import { calculateStaggerDelay, calculateTotalStaggerDuration } from '../utils/timing.utils';

export interface StaggerConfig {
  childCount: number;
  staggerValue: number;
  staggerDirection: number;
  delayChildren: number;
  parentDelay: number;
}

@Injectable({
  providedIn: 'root'
})
export class MotionStaggerService {

  /**
   * Calculate the delay for a specific child in a stagger sequence
   */
  calculateChildDelay(
    index: number,
    config: StaggerConfig
  ): number {
    const staggerDelay = calculateStaggerDelay(
      index,
      config.childCount,
      config.staggerValue,
      config.staggerDirection
    );

    return config.parentDelay + config.delayChildren + staggerDelay;
  }

  /**
   * Calculate delays for all children in a stagger sequence
   */
  calculateAllChildDelays(config: StaggerConfig): number[] {
    const delays: number[] = [];

    for (let i = 0; i < config.childCount; i++) {
      delays.push(this.calculateChildDelay(i, config));
    }

    return delays;
  }

  /**
   * Calculate the total duration for a stagger animation sequence
   */
  calculateTotalDuration(config: StaggerConfig): number {
    return calculateTotalStaggerDuration(
      config.childCount,
      config.staggerValue,
      config.parentDelay,
      config.delayChildren
    );
  }

  /**
   * Determine the stagger index based on direction
   */
  getStaggerIndex(index: number, childCount: number, direction: number): number {
    if (direction >= 0) {
      return index; // Forward: 0, 1, 2, 3...
    } else {
      return childCount - 1 - index; // Reverse: 3, 2, 1, 0...
    }
  }
}
