import { Component, Input, AfterContentInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf, NgComponentOutlet } from '@angular/common';
import { MotionOneService } from '../services/motion-one.service';
import { Router, NavigationStart, RouterOutlet, NavigationEnd, Event, NavigationCancel, NavigationError } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { OnInit } from '@angular/core';

@Component({
  selector: 'motion-one-presence',
  template: `
    <div class="router-container">
      <div *ngIf="previousComponent" class="router-component previous">
        <ng-container *ngComponentOutlet="previousComponent"></ng-container>
      </div>
      <div class="router-component current">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .router-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .router-component {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    .previous {
      z-index: 1;
    }
    .current {
      z-index: 2;
    }
    .debug-indicator {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
    }
    .previous-indicator {
      background: rgba(255,0,0,0.7);
    }
    .current-indicator {
      background: rgba(0,128,0,0.7);
    }
  `],
  standalone: true,
  providers: [MotionOneService],
  imports: [NgIf, NgComponentOutlet]
})
export class MotionOnePresenceComponent implements OnInit, OnDestroy {
  @Input() mode: 'sync' | 'wait' = 'wait';
 
  @ViewChild(RouterOutlet) routerOutlet?: RouterOutlet;
  
  previousComponent: any = null;
  currentComponent: any = null;
  private routerSubscription = new Subscription();
  private destroy$ = new Subject<void>();
  private previousRoute: string | null = null;
  private currentRoute: string | null = null;
  private exitDuration: number = 0;
  private isAnimating: boolean = false;

  constructor(
    private router: Router,
    private motionService: MotionOneService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
   
  }
  
  ngOnInit(): void {
        // Listen for router events
        this.routerSubscription = this.router.events.subscribe((event: Event) => {
          if (event instanceof NavigationStart) {
    
            
          
            this.previousRoute = this.router.url;
            this.currentRoute = (event as NavigationStart).url;
            
            console.log(`ACI [MotionOnePresence] Navigation from ${this.previousRoute} to ${this.currentRoute}`);
              
            this.motionService.runAllExitAnimations();
          }
          
          if (event instanceof NavigationEnd) {
           
            this.currentRoute = event.urlAfterRedirects;
            console.log('ACI [MotionOnePresence] Navigation to:', this.currentRoute);
    
            //  this.motionService.runAllEnterAnimations();
          
          }
        });
  }
  
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.routerSubscription.unsubscribe();
  }
}