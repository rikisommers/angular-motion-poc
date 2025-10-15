import {
  Injectable,
  signal,
  HostListener,
  computed,
  effect,
  inject,
  OnDestroy,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MotionDirective } from '../../directives/ngx-motion.directive';
import { Subject, Observable, forkJoin, finalize, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { fromEvent, of, Subscription } from 'rxjs';
import { throttleTime, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MotionService {
  private scrollSubscription: Subscription;
  private motionElements: MotionDirective[] = [];
  scrollYProgress = signal(0);
  totalExitDuration: number = 0;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.setupScrollListener();
    this.scrollSubscription = new Subscription();
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  private updateTotalExitDuration() {
    this.totalExitDuration = this.motionElements.reduce((total, element) => {
      return total + element.getDuration();
    }, 0);
  }

  private setupScrollListener() {
    if (typeof window !== 'undefined') {
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
  }

  private updateScrollProgress() {
    const doc = this.document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const progress =
      scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
    this.scrollYProgress.set(progress);
  }

  registerMotionElement(element: MotionDirective) {
    this.motionElements.push(element);
    this.updateTotalExitDuration();
  }

  unregisterMotionElement(element: MotionDirective) {
    this.motionElements = this.motionElements.filter((e) => e !== element);
    this.updateTotalExitDuration();
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

  runAllEnterAnimations(): void {
    const enterAnimations = this.motionElements.map((motion) => {
      //      motion.runInitAnimation();
    });
  }

  runAllExitAnimations(): void {
    // Proceed with the exit animations
    this.motionElements.map((motion) => {
      //motion.runExitAnimation();
    });
  }

  runAllEnterAnimationsForRoute(route: string): MotionDirective[] {
    const enterAnimations = this.getAllElementsByRoute(route).map((motion) => {
      motion.runInitAnimation();
      return motion;
    });
    return enterAnimations;
  }
  
  getLongestExitDuration(): number {
    const durations = this.motionElements.map((motion) => motion.getDuration());
    return durations.length > 0 ? Math.max(...durations) : 0;
  }

  getLongestEnterDuration(): number {
    const durations = this.motionElements.map((motion) => motion.getDuration());
    return durations.length > 0 ? Math.max(...durations) : 0;
  }

  getLongestDurationForRoute(): number {
    const route = this.router.url;
    const elements = this.getAllElementsByRoute(route);
    const durations = elements.map((motion) => motion.getDuration());
    console.log('durations', durations.length > 0 ? Math.max(...durations) : 0);
    return durations.length > 0 ? Math.max(...durations) : 0;
  }
}
