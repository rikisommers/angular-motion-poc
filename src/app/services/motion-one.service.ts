import {
    Injectable,
    Inject,
    signal,
    PLATFORM_ID
  } from '@angular/core';
  import { DOCUMENT, isPlatformBrowser } from '@angular/common';
  import { fromEvent, Subscription, Subject, Observable, timer } from 'rxjs';
  import { throttleTime, debounceTime, take, map } from 'rxjs/operators';
  import { Router } from '@angular/router';
  
  // Define the interface for motion elements
  export interface MotionElement {
    elementId: string;
    getDuration(): number;
    runInitAnimation(): void;
    runExitAnimation(): void;
    cancel(): void;
    route?: string;
  }
  
  @Injectable({
    providedIn: 'root',
  })
  export class MotionOneService {
    private scrollSubscription: Subscription;
    private motionElements: MotionElement[] = [];
    scrollYProgress = signal(0);
    totalExitDuration: number = 0;
    
    // Subject that emits when all exit animations for a route are complete
    private exitAnimationsComplete = new Subject<string>();
    
    // Subject that emits when all enter animations for a route are complete
    private enterAnimationsComplete = new Subject<string>();
    
    // Track active exit animations by route
    private activeExitAnimations: Map<string, number> = new Map();
    
    // Track active enter animations by route
    private activeEnterAnimations: Map<string, number> = new Map();
  
    constructor(
      private router: Router,
      @Inject(DOCUMENT) private document: Document,
      @Inject(PLATFORM_ID) private platformId: Object
    ) {
      this.setupScrollListener();
      this.scrollSubscription = new Subscription();
    }
  
    ngOnDestroy() {
      if (this.scrollSubscription) {
        this.scrollSubscription.unsubscribe();
      }
      this.exitAnimationsComplete.complete();
      this.enterAnimationsComplete.complete();
    }
  
    private updateTotalExitDuration() {
      if (!isPlatformBrowser(this.platformId)) return;
      
      this.totalExitDuration = this.motionElements.reduce((total, element) => {
        return total + element.getDuration();
      }, 0);
    }
  
    private setupScrollListener() {
      if (!isPlatformBrowser(this.platformId)) return;
      
      this.scrollSubscription = fromEvent(window, 'scroll')
        .pipe(
          throttleTime(16), // Limit to about 60fps
          debounceTime(1), // Wait for scroll to settle
        )
        .subscribe(() => {
          this.updateScrollProgress();
        });
      this.updateScrollProgress();
    }
  
    private updateScrollProgress() {
      if (!isPlatformBrowser(this.platformId)) return;
      
      const doc = this.document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const progress =
        scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
      this.scrollYProgress.set(progress);
    }
  
    registerMotionElement(element: MotionElement) {
      this.motionElements.push(element);
      this.updateTotalExitDuration();
    }
  
    unregisterMotionElement(element: MotionElement) {
      this.motionElements = this.motionElements.filter((e) => e !== element);
      this.updateTotalExitDuration();
    }
  
    getMotionElements(): MotionElement[] {
      return this.motionElements;
    }
  
    getAllElementsByRoute(route: string): MotionElement[] {
      const elements = this.motionElements.filter(element => element.route === route);
      //console.log(`[MotionOneService] Found ${elements.length} elements for route ${route} (out of ${this.motionElements.length} total)`);
      

      
      return elements;
    }
  
    cancelAllAnimations() {
      if (!isPlatformBrowser(this.platformId)) return;
      
      this.motionElements.forEach((motion) => {
        motion.cancel();
      });
    }
  
    runAllEnterAnimations(): void {
      if (!isPlatformBrowser(this.platformId)) return;
      
      this.motionElements.forEach((motion) => {
        motion.runInitAnimation();
      });
    } 
  
    runAllExitAnimations(): void {
      if (!isPlatformBrowser(this.platformId)) return;
      
      this.motionElements.forEach((motion) => {
        console.log(motion)
        motion.runExitAnimation();
      });
    }
  
    /**
     * Get an observable that emits true when all exit animations for a route are complete
     * @param route The route to check for animation completion
     * @returns Observable that emits true when animations are complete
     */
    getExitAnimationsComplete(route: string): Observable<boolean> {
      if (!isPlatformBrowser(this.platformId)) {
        // If not in browser, immediately emit true
        return timer(0).pipe(
          take(1),
          map(() => true)
        );
      }
      
      // Get the exit duration for the route
      const exitDuration = this.getLongestExitDurationForRoute(route);
     // console.log(`[MotionOneService] Setting up exit animations complete for route ${route} with duration ${exitDuration}s`);
      
      // If no animations or duration is 0, immediately emit true
      if (exitDuration === 0 || this.getAllElementsByRoute(route).length === 0) {
      //  console.log(`[MotionOneService] No exit animations for route ${route}, emitting complete immediately`);
        return timer(0).pipe(
          take(1),
          map(() => true)
        );
      }
      
      // Otherwise, wait for the exit duration and then emit true
      return timer(exitDuration * 1000).pipe(
        take(1),
        map(() => true)
      );
    }
    
    /**
     * Get an observable that emits true when all enter animations for a route are complete
     * @param route The route to check for animation completion
     * @returns Observable that emits true when animations are complete
     */
    getEnterAnimationsComplete(route: string): Observable<boolean> {
      if (!isPlatformBrowser(this.platformId)) {
        // If not in browser, immediately emit true
        return timer(0).pipe(
          take(1),
          map(() => true)
        );
      }
      
      // Get the enter duration for the route
      const enterDuration = this.getLongestEnterDurationForRoute(route);
     // console.log(`[MotionOneService] Setting up enter animations complete for route ${route} with duration ${enterDuration}s`);
      
      // If no animations or duration is 0, immediately emit true
      if (enterDuration === 0 || this.getAllElementsByRoute(route).length === 0) {
     //   console.log(`[MotionOneService] No enter animations for route ${route}, emitting complete immediately`);
        return timer(0).pipe(
          take(1),
          map(() => true)
        );
      }
      
      // Otherwise, wait for the enter duration and then emit true
      return timer(enterDuration * 1000).pipe(
        take(1),
        map(() => true)
      );
    }
    
    /**
     * Start tracking exit animations for a route
     * @param route The route to track
     */
    startExitAnimationsForRoute(route: string): void {
      if (!isPlatformBrowser(this.platformId)) return;
      
      const elements = this.getAllElementsByRoute(route);
      this.activeExitAnimations.set(route, elements.length);
      
      //console.log(`[MotionOneService] Starting exit animations for route ${route} with ${elements.length} elements`);
      
      // If no elements, immediately mark as complete
      if (elements.length === 0) {
        this.completeExitAnimationsForRoute(route);
        return;
      }
      
      // Run exit animations for all elements in this route
      elements.forEach(element => {
        element.runExitAnimation();
      });
      
      // Get the longest duration and set a timer to mark animations as complete
      const exitDuration = this.getLongestExitDurationForRoute(route);
      setTimeout(() => {
        this.completeExitAnimationsForRoute(route);
      }, exitDuration * 1000);
    }
    
    /**
     * Start tracking enter animations for a route
     * @param route The route to track
     */
    startEnterAnimationsForRoute(route: string): void {
      if (!isPlatformBrowser(this.platformId)) return;
      
      const elements = this.getAllElementsByRoute(route);
      this.activeEnterAnimations.set(route, elements.length);
      
     // console.log(`[MotionOneService] Starting enter animations for route ${route} with ${elements.length} elements`);
      
      // If no elements, immediately mark as complete
      if (elements.length === 0) {
        this.completeEnterAnimationsForRoute(route);
        return;
      }
      
      // Run enter animations for all elements in this route
      elements.forEach(element => {
        element.runInitAnimation();
      });
      
      // Get the longest duration and set a timer to mark animations as complete
      const enterDuration = this.getLongestEnterDurationForRoute(route);
      setTimeout(() => {
        this.completeEnterAnimationsForRoute(route);
      }, enterDuration * 1000);
    }
    
    /**
     * Mark exit animations for a route as complete
     * @param route The route to mark as complete
     */
    private completeExitAnimationsForRoute(route: string): void {
      console.log(`[MotionOneService] Exit animations complete for route ${route}`);
      this.activeExitAnimations.delete(route);
      this.exitAnimationsComplete.next(route);
    }
    
    /**
     * Mark enter animations for a route as complete
     * @param route The route to mark as complete
     */
    private completeEnterAnimationsForRoute(route: string): void {
      console.log(`[MotionOneService] Enter animations complete for route ${route}`);
      this.activeEnterAnimations.delete(route);
      this.enterAnimationsComplete.next(route);
    }
    
    /**
     * Check if exit animations for a route are complete
     * @param route The route to check
     * @returns True if animations are complete or not running
     */
    areExitAnimationsComplete(route: string): boolean {
      return !this.activeExitAnimations.has(route);
    }
    
    /**
     * Check if enter animations for a route are complete
     * @param route The route to check
     * @returns True if animations are complete or not running
     */
    areEnterAnimationsComplete(route: string): boolean {
      return !this.activeEnterAnimations.has(route);
    }
  
    runAllExitAnimationsForRoute(route: string): MotionElement[] {
      if (!isPlatformBrowser(this.platformId)) return [];
      
      // Start tracking animations for this route
      this.startExitAnimationsForRoute(route);
      
      return this.getAllElementsByRoute(route);
    }
    
    runAllEnterAnimationsForRoute(route: string): MotionElement[] {
      if (!isPlatformBrowser(this.platformId)) return [];
      
      // Start tracking animations for this route
      this.startEnterAnimationsForRoute(route);
      
      return this.getAllElementsByRoute(route);
    }
    
    getLongestExitDurationForRoute(route: string): number {
      if (!isPlatformBrowser(this.platformId)) return 0;
      
     // console.log(`[MotionOneService] Getting longest exit duration for route ${route}`);
      
      if (this.motionElements.length === 0) {
      //  console.log('[MotionOneService] No motion elements registered');
        return 0;
      }
      
      const elements = this.getAllElementsByRoute(route);
      if (elements.length === 0) {
      //  console.log(`[MotionOneService] No elements found for route ${route}`);
        return 0;
      }
      
      const durations = elements.map((motion) => {
        const duration = motion.getDuration();
     //   console.log(`[MotionOneService] Element ${motion.elementId} has exit duration: ${duration}s`);
        return duration;
      });
      
      const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
     console.log(`[MotionOneService] Longest exit duration for route ${route}: ${maxDuration}s`);
      return maxDuration;
    }
    
    getLongestEnterDurationForRoute(route: string): number {
      if (!isPlatformBrowser(this.platformId)) return 0;
      
    //  console.log(`[MotionOneService] Getting longest enter duration for route ${route}`);
      
      if (this.motionElements.length === 0) {
    //    console.log('[MotionOneService] No motion elements registered');
        return 0;
      }
      
      const elements = this.getAllElementsByRoute(route);
      if (elements.length === 0) {
    //    console.log(`[MotionOneService] No elements found for route ${route}`);
        return 0;
      }
      
      const durations = elements.map((motion) => {
        const duration = motion.getDuration();
    //    console.log(`[MotionOneService] Element ${motion.elementId} has enter duration: ${duration}s`);
        return duration;
      });
      
      const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
      console.log(`[MotionOneService] Longest enter duration for route ${route}: ${maxDuration}s`);
      return maxDuration;
    }
  
    getLongestEnterDuration(): number {
      if (!isPlatformBrowser(this.platformId)) return 0;
      
    //  console.log(`[MotionOneService] Getting longest enter duration from ${this.motionElements.length} elements`);
      
      if (this.motionElements.length === 0) {
     //   console.log('[MotionOneService] No motion elements registered');
        return 0;
      }
      
      const durations = this.motionElements.map((motion) => {
        const duration = motion.getDuration();
     //   console.log(`[MotionOneService] Element ${motion.elementId} has duration: ${duration}s`);
        return duration;
      });
      
      const maxDuration = durations.length > 0 ? Math.max(...durations) : 0;
      console.log(`[MotionOneService] Longest enter duration: ${maxDuration}s`);
      return maxDuration;
    }
  }
  