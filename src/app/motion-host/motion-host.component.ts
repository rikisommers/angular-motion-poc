import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router,ActivatedRoute,NavigationStart, NavigationEnd } from '@angular/router';
import { routeTransition } from '../../directives/motion-transition';
import { MotionService } from '../services/motion.service';
import { MotionDirective } from '../../directives/ngx-motion.directive';


@Component({
  selector: 'app-motion-host',
  templateUrl: './motion-host.component.html',
  standalone: true,
  animations: [
    routeTransition
  ]
})
export class MotionHostComponent implements OnInit {

  exitDelay = 0;
  constructor(
    private router: Router, 
    private motionService: MotionService,
    protected route: ActivatedRoute,
  ) {
    this.exitDelay = motionService.getLongestExitDuration();

  }


  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Trigger exit animation
        console.log('NAVV START')
       // this.motionService.runAllEnterAnimations();
      }
      if (event instanceof NavigationEnd) {
        // Trigger exit animation
        console.log('NAVV END')
       // this.motionService.runAllEnterAnimations();
      }
    });

    // // Subscribe to exit animation completion
    // this.animationService.exitAnimationComplete$.subscribe(() => {
    //   // After exit animation completes, set the new state
    //   this.currentAnimationState = 'animate'; // Set to the desired state for the new route
    // });
  }
  
  private triggerExitAnimations() {
    const motionElements = this.motionService.getMotionElements();
    if (motionElements.length > 0) {
      motionElements.forEach((motion: MotionDirective) => {
        
       // motion.runExitAnimation();
        // motion.player.onDone(() => {
        //   motion.variant = 'initial';
        //   motion.run();
        // });
      });
    }
  }
  
}