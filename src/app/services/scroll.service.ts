import { Injectable, NgZone } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private zone: NgZone
  ) {
    this.initializeScrollHandler();
  }

  private initializeScrollHandler() {
    this.router.events.pipe(
      filter(event => event instanceof Scroll)
    ).subscribe({
      next: (e: Scroll) => {
        if (e.anchor) {
          this.scrollToAnchor(e.anchor);
        }
      }
    });
  }

  scrollToAnchor(anchor: string, delay: number = 100) {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.viewportScroller.scrollToAnchor(anchor);
        });
      }, delay);
    });
  }

  scrollToElement(elementId: string, delay: number = 100) {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        });
      }, delay);
    });
  }

  navigateToFragment(fragment: string) {
    this.router.navigateByUrl(this.router.url.split('#')[0] + '#' + fragment, {
      skipLocationChange: false
    });
  }

  refreshAndScrollToFragment() {
    if (this.router.url.indexOf('#') > -1) {
      this.router.navigateByUrl(this.router.url, { skipLocationChange: true });
    }
  }
}