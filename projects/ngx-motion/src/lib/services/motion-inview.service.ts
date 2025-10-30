import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MOTION_DEFAULTS } from '../constants/motion-defaults.constants';

export interface IntersectionObserverConfig {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

@Injectable({
  providedIn: 'root'
})
export class MotionInViewService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Create an IntersectionObserver with the given configuration
   */
  createObserver(
    callback: IntersectionObserverCallback,
    config: IntersectionObserverConfig = {}
  ): IntersectionObserver | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const observerConfig: IntersectionObserverInit = {
      root: config.root ?? null,
      rootMargin: config.rootMargin ?? MOTION_DEFAULTS.INVIEW_ROOT_MARGIN,
      threshold: config.threshold ?? MOTION_DEFAULTS.INVIEW_THRESHOLD
    };

    return new IntersectionObserver(callback, observerConfig);
  }

  /**
   * Create a standard IntersectionObserver for runInView functionality
   */
  createRunInViewObserver(
    element: HTMLElement,
    onEntry: () => void,
    onExit: () => void
  ): IntersectionObserver | null {
    return this.createObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onEntry();
          } else {
            onExit();
          }
        });
      },
      {
        root: null,
        rootMargin: MOTION_DEFAULTS.INVIEW_ROOT_MARGIN,
        threshold: MOTION_DEFAULTS.INVIEW_THRESHOLD
      }
    );
  }

  /**
   * Parse margin string (e.g., "0px", "10px 20px")
   */
  parseMargin(margin: string): string {
    // Ensure margin is in valid format for IntersectionObserver
    if (!margin) return MOTION_DEFAULTS.INVIEW_MARGIN;
    return margin;
  }

  /**
   * Check if IntersectionObserver is supported
   */
  isSupported(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return 'IntersectionObserver' in window;
  }

  /**
   * Safely disconnect an observer
   */
  disconnect(observer: IntersectionObserver | null | undefined): void {
    if (observer) {
      observer.disconnect();
    }
  }
}
