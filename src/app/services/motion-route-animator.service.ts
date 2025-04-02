import { Injectable, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, Event, NavigationCancel } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { MotionOneService } from './motion-one.service';

@Injectable({
  providedIn: 'root'
})
export class MotionRouteAnimatorService implements OnDestroy {
  private routerSubscription = new Subscription();
  private currentRoute: string | null = null;
  private previousRoute: string | null = null;
  private isNavigating = false;
  private pendingNavigation: string | null = null;

  constructor(
    private router: Router,
    private motionService: MotionOneService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initRouteListener();
  }

  private initRouteListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      // When navigation starts
      if (event instanceof NavigationStart) {
        // Skip if we're already handling a navigation
        if (this.isNavigating) return;

        this.previousRoute = this.router.url;
        this.currentRoute = (event as NavigationStart).url;
        this.isNavigating = true;
        
        console.log(`[MotionRouteAnimator] Navigation from ${this.previousRoute} to ${this.currentRoute}`);
        
        // Run exit animations for the current route
        this.motionService.runAllExitAnimationsForRoute(this.previousRoute || '');
        
        // Get the longest exit animation duration
        const longestDuration = this.motionService.getLongestExitDurationForRoute(this.previousRoute || '');
        
        console.log(`[MotionRouteAnimator] Longest exit animation duration: ${longestDuration}ms`);
        
        // If there are exit animations, delay the navigation
        if (longestDuration > 0) {
          // Store the pending navigation URL
          this.pendingNavigation = this.currentRoute;
          
          // Cancel the current navigation
          this.router.navigateByUrl(this.previousRoute || '', { skipLocationChange: true });
          
          // Wait for animations to complete, then navigate
          setTimeout(() => {
            console.log(`[MotionRouteAnimator] Exit animations complete, navigating to ${this.pendingNavigation}`);
            if (this.pendingNavigation) {
              this.router.navigateByUrl(this.pendingNavigation);
              this.pendingNavigation = null;
            }
            this.isNavigating = false;
          }, longestDuration);
        }
      }
      
      // When navigation ends
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        if (!this.pendingNavigation) {
          this.currentRoute = this.router.url;
          console.log(`[MotionRouteAnimator] Navigation complete to: ${this.currentRoute}`);
          this.isNavigating = false;
        }
      }
    });
  }
  
  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
} 