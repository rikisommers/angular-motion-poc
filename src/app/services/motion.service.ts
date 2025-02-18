import { Injectable } from '@angular/core';
import { MotionDirective } from '../../directives/ngx-motion.directive';
import { Subject, Observable, forkJoin, finalize, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MotionService {
  private motionElements: MotionDirective[] = [];
  public exitAnimationsComplete$ = new BehaviorSubject<boolean>(false);
  private exitAnimationsInProgressSubject = new BehaviorSubject<boolean>(false);
  exitAnimationsInProgress = this.exitAnimationsInProgressSubject.asObservable();

  

  
  totalExitDuration: number = 0;
  constructor(private router: Router) {
  }

  registerMotionElement(element: MotionDirective) {
    this.motionElements.push(element);
    this.updateTotalExitDuration();
  }

  unregisterMotionElement(element: MotionDirective) {
    this.motionElements = this.motionElements.filter(e => e !== element);
    this.updateTotalExitDuration();
  }


  private updateTotalExitDuration() {
    this.totalExitDuration = this.motionElements.reduce((total, element) => {
      return total + element.getDuration();
    }, 0);
  }

  getMotionElements(): MotionDirective[] {
    return this.motionElements;
  }


  getAllElementsByRoute(route: string): MotionDirective[] {
    return this.motionElements;
  }


  cancelAllAnimations() {
    this.motionElements.forEach((motion) => {
      motion.cancel();
    });
  }
  
  /**
   * Triggers all enter animations and returns an Observable that completes when all animations are done.
   */
  runAllEnterAnimations(): Observable<void> {
    const enterAnimations = this.motionElements.map((motion) => {
      motion.runInitAnimation();
      //return this.waitForAnimation(motion);
    });

    return forkJoin(enterAnimations).pipe(
      map(() => {
        console.log('All enter animations complete');
        this.exitAnimationsComplete$.next(true);
      })
    );
  }

  /**
   * Triggers all exit animations and returns an Observable that completes when all animations are done.
   */
  runAllExitAnimations(): void {
    

    // Proceed with the exit animations
    this.motionElements.map((motion) => {
      motion.runExitAnimation();
    });

   
  }
  

  /**
   * Creates an Observable that emits when a specific motion element's animation completes.
   * @param motion MotionDirective instance
   */
  private waitForAnimation(motion: MotionDirective): Observable<void> {
    return new Observable<void>((observer) => {
      const subscription = motion.animationComplete.subscribe(() => {
        observer.next();
        observer.complete();
      });

      // Cleanup if the Observable is unsubscribed before emission
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Returns the longest exit animation duration in milliseconds among all motion elements.
   */
  getLongestExitDuration(): number {
    const durations = this.motionElements.map((motion) => motion.getDuration());
    return durations.length > 0 ? Math.max(...durations) : 0;
  }

  /**
   * Returns the longest enter animation duration in milliseconds among all motion elements.
   */
  getLongestEnterDuration(): number {
    const durations = this.motionElements.map((motion) => motion.getDuration());
    return durations.length > 0 ? Math.max(...durations) : 0;
  }

  runAllEnterAnimationsForRoute(route: string): MotionDirective[] {
    const enterAnimations = this.getAllElementsByRoute(route).map((motion) => {
      motion.runInitAnimation();
      return motion;
    });
    return enterAnimations;
  }

  getLongestDurationForRoute(): number {
    const route = this.router.url;
    const elements = this.getAllElementsByRoute(route);
    const durations = elements.map((motion) => motion.getDuration());
    console.log('durations', durations.length > 0 ? Math.max(...durations) : 0);
    return durations.length > 0 ? Math.max(...durations) : 0;

  }


}
