import { Injectable } from '@angular/core';
import { MotionDirective } from '../../directives/ngx-motion.directive';
import { Subject, Observable, forkJoin, finalize, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MotionService {
  private motionElements: MotionDirective[] = [];
  public exitAnimationsComplete$ = new BehaviorSubject<boolean>(false);
  private exitAnimationsInProgressSubject = new BehaviorSubject<boolean>(false);
  exitAnimationsInProgress = this.exitAnimationsInProgressSubject.asObservable();

  

  
  totalExitDuration: number = 0;
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
      return this.waitForAnimation(motion);
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
  runAllExitAnimations(): Observable<boolean> {
    
    this.exitAnimationsComplete$.next(true);
    // Check if the exit animations are already in progress
    if (this.exitAnimationsInProgressSubject.value) {
      console.log('Exit animations are already in progress, ignoring the call');
      this.cancelAllAnimations();
      return of(true);  // Return false immediately if the exit animations are already in progress
    }

    // Check if there are no motion elements
    if (this.motionElements.length === 0) {
      console.log('No motion elements found, returning true');
      return of(true);  // Return true immediately if no motion elements
    }

    // Set the exitAnimationsInProgress flag to true
    this.exitAnimationsInProgressSubject.next(true);

    // Proceed with the exit animations
    const exitAnimations = this.motionElements.map((motion) => {
      motion.runExitAnimation();
      return this.waitForAnimation(motion);
    });

    return forkJoin(exitAnimations).pipe(
      map(() => {
        
        this.exitAnimationsComplete$.next(false);
        console.log('All exit animations complete');
        this.exitAnimationsInProgressSubject.next(false);  // Emit a new value to indicate that the exit animations are complete
        return true;  // Ensures boolean return type
      }),
      catchError(() => {
        console.error('Error during exit animations');
        return of(false);  // In case of error, return false
      }),
      finalize(() => this.exitAnimationsInProgressSubject.next(false))  // Set the exitAnimationsInProgress flag to false when the animations are complete
    );
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
}
