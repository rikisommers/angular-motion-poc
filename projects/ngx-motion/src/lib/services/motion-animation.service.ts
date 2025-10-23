import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as motion from 'motion';
import type { AnimationOptions, Target, ValueAnimationOptions, SpringOptions } from 'motion';

@Injectable({
  providedIn: 'root'
})
export class MotionAnimationService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Mock implementations for server environment
  private mockAnimate = () => ({ stop: () => {} });
  private mockEasing = (t: number) => t;
  private mockStagger = () => 0;
  private mockSpring = () => motion.easeInOut;

  // Wrapper for animate function
  animate(target: any, keyframes: any, options?: any): any {
    if (!isPlatformBrowser(this.platformId)) {
      return this.mockAnimate();
    }
    
    try {
      return motion.animate(target, keyframes, options);
    } catch (e) {
      console.error('Error in animate:', e);
      return this.mockAnimate();
    }
  }

  // Wrapper for easing functions
  get easeIn() {
    return isPlatformBrowser(this.platformId) ? (motion as any).easeIn : this.mockEasing;
  }

  get easeOut() {
    return isPlatformBrowser(this.platformId) ? (motion as any).easeOut : this.mockEasing;
  }

  get easeInOut() {
    return isPlatformBrowser(this.platformId) ? (motion as any).easeInOut : this.mockEasing;
  }

  // Wrapper for stagger function
  stagger(duration: number, options?: any): any {
    if (!isPlatformBrowser(this.platformId)) {
      return this.mockStagger();
    }
    
    try {
      return motion.stagger(duration, options);
    } catch (e) {
      console.error('Error in stagger:', e);
      return this.mockStagger();
    }
  }

  get spring() {
    if (!isPlatformBrowser(this.platformId)) {
      return this.mockSpring;
    }
    
    return (options?: { stiffness?: number; damping?: number }) => {
      const m: any = motion as any;
      try {
        // Prefer Motion One spring factory if available
        if (typeof m.spring === 'function') {
          return m.spring({
            stiffness: options?.stiffness ?? 100,
            damping: options?.damping ?? 10
          });
        }
        // Motion 10 shim: use m.createGenerator?.spring
        if (m?.createGenerator?.spring) {
          return m.createGenerator.spring({
            stiffness: options?.stiffness ?? 100,
            damping: options?.damping ?? 10
          });
        }
      } catch {}
      // Fallback to an ease function if no spring present
      return (m?.easeInOut as any) ?? ((t: number) => t);
    };
  }
} 