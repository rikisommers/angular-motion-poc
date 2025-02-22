import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute, Router, NavigationEnd , NavigationStart} from '@angular/router';
import {  MotionDirective } from '../directives/ngx-motion.directive';
import { MotionHostComponent } from './motion-host/motion-host.component';
import { routeTransition } from '../directives/motion-transition';
import { PageTransitionComponent } from './page-transition/page-transition.component';
import { MotionService } from './services/motion.service';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    MotionDirective,
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
  motionElements: MotionDirective[] = [];
  maxDelay: string = '1s';

  constructor(
    protected route: ActivatedRoute,
    private router: Router,
    private motionService: MotionService,

    // private routeAnimService: RouteAnimationService
  ) {

  }


  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const currentRoute = event.url;
        const nextRoute = this.router.url;
        console.log('START',this.motionElements);

        const currentRouteElements = this.motionService.getAllElementsByRoute(currentRoute);

        this.motionService.runAllEnterAnimationsForRoute(currentRoute);

        this.maxDelay = this.getLongestDuration(currentRouteElements);

        console.log('maxDelay',this.maxDelay);
        
        // Do something with the current and next route elements
        console.log('prevRouteElements',currentRouteElements);
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.url;
        const nextRoute = this.router.url;

        console.log('END',this.motionElements);
      //  this.motionService.runAllExitAnimations;
        const currentRouteElements = this.motionService.getAllElementsByRoute(currentRoute);
        // Do something with the current and next route elements  

        console.log('newRouteElements',currentRouteElements);
      }
    });


  }


  togglePanel() {
    this.isPanelOpen = !this.isPanelOpen;
    console.log("toggle");

  }


  getLongestDuration(elements: MotionDirective[]): string {
    return elements.reduce((max, element) => {
      const delay = element.getDuration();
      return Math.max(max, delay);
    }, 0).toString() + 's';
  }
  
}
