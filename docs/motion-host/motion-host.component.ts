import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,NavigationStart, NavigationEnd } from '@angular/router';
import { routeTransition } from '../../directives/motion-transition';
import { MotionService } from '../services/motion.service';
import { MotionDirective } from '../../directives/ngx-motion.directive';


@Component({
  selector: 'motion-host',
  templateUrl: './motion-host.component.html',
  standalone: true,
  animations: [
    routeTransition
  ]
})
export class MotionHostComponent implements OnInit {

  exitDelay = 0;
  maxDelay = '0ms';
  constructor(
    private router: Router, 
    private motionService: MotionService,
    protected route: ActivatedRoute,
  ) {

  }


  //TODO: Set longest duration based on current route elements
  ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const currentRoute = event.url;

        this.maxDelay = this.motionService.getLongestExitDuration().toString();
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.motionService.runAllEnterAnimations();


      }
    });

  }

  
}