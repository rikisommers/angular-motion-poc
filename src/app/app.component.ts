import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import {  MotionDirective } from '../directives/ngx-motion.directive';
import { MotionHostDirective } from '../directives/ngx-motion-container.directive';
import { MotionHostComponent } from './motion-host/motion-host.component';
import { routeTransition } from '../directives/motion-transition';
import { PageTransitionComponent } from './page-transition/page-transition.component';
import { RouteAnimationService } from './services/route-animation.service';
import { MotionService } from './services/motion.service';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    MotionDirective,
     MotionHostDirective, 
     MotionHostComponent,
    PageTransitionComponent
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    routeTransition
  ]
})
export class AppComponent implements OnInit {

  @ViewChild(RouterOutlet, { static: true }) outlet!: RouterOutlet;

  title = 'angular';

  isPanelOpen = true;
  animInProgress: boolean = false;

  constructor(
    protected route: ActivatedRoute,
    private motionService: MotionService
    // private routeAnimService: RouteAnimationService
  ) {

  }
  ngOnInit() {
    this.motionService.exitAnimationsComplete$.asObservable().subscribe((inProgress) => {
      this.animInProgress = inProgress;
    });
  }

  getRouteAnimationData() {
    const exitDuration = this.motionService.getLongestExitDuration(); // in ms
    const enterDuration = 1000; // Set as needed or also retrieve from MotionService
    return {
      value: '',
      params: {
        exitDuration: exitDuration,
        enterDuration: exitDuration,
        enterDelay: exitDuration,
        exitDelay:exitDuration
      }
    };
  }

  togglePanel() {
    this.isPanelOpen = !this.isPanelOpen;
    console.log("toggle");

  }

  onAnimationComplete() {
    // Perform navigation or any other action after all exit animations are complete

    console.log("complete");
  }

}
