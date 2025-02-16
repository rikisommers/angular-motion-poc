import { Injectable, Inject } from '@angular/core';
import { Router, NavigationStart, NavigationExtras, Event } from '@angular/router';
import { MotionService } from './motion.service';
import { filter, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private navigationInProgress = false;
  private originalNavigate: Function;

  constructor(
    @Inject(Router) private router: Router,
    private motionService: MotionService
  ) {
    this.originalNavigate = router.navigate.bind(this.router);
    
    // Override the router's navigate method
    this.overrideNavigate();

    // Listen for navigation events if needed
    // (Optional based on specific requirements)
  }

  /**
   * Overrides the router's navigate method to include animation delays.
   */
  private overrideNavigate() {
    this.router.navigate = (...args: [any[], NavigationExtras?]): Promise<boolean> => {
      if (this.navigationInProgress) {
        // Prevent multiple navigations at the same time
        return Promise.resolve(false);
      }

      this.navigationInProgress = true;

      // Run all exit animations
      return new Promise<boolean>((resolve) => {
        this.motionService.runAllExitAnimations().subscribe(() => {
          const exitAnimationDuration = this.motionService.getLongestExitDuration();

          // Delay navigation to ensure animations are settled
          setTimeout(() => {
            this.originalNavigate(...args).then((result: boolean) => {
              this.navigationInProgress = false;
              resolve(result);
            }).catch((err: any) => {
              this.navigationInProgress = false;
              resolve(false);
            });
          }, exitAnimationDuration);
        });
      });
    };
  }

  /**
   * Method to use for navigation to ensure proper handling.
   * @param commands Router navigation commands
   * @param extras Optional navigation extras
   */
  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(commands, extras);
  }
}