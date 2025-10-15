import { Component, OnInit } from '@angular/core';
import { MotionOneDirective } from '../../../directives/motion-one.directive';
import { cubicBezier, spring } from 'motion';

@Component({
  selector: 'app-page-transition',
  imports: [MotionOneDirective],
  templateUrl: './page-transition.component.html',
  styleUrl: './page-transition.component.scss',
  standalone: true,
})
export class PageTransitionComponent implements OnInit {
  animate = 'animate'; // Start with the 'animate' variant

  ngOnInit() {
    // Start with the 'animate' variant
    console.log('Component initialized, starting with animate variant');
  }

  onAnimationComplete(): void {
    console.log('Animation complete, triggering onEnd variant');
    // The onEnd variant will be triggered automatically after 2.5 seconds
    // due to the 'at' property in the variant definition
  }
}
