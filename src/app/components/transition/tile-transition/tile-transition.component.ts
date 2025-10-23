import { Component, OnInit } from '@angular/core';
import { MotionOneDirective } from 'ngx-motion';
import { cubicBezier, spring } from 'motion';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-tile-transition',
  imports: [MotionOneDirective],
  templateUrl: './tile-transition.component.html',
  standalone: true,
  styleUrl: './tile-transition.component.scss'
})
export class TileTransitionComponent {
  animate = 'animate'; // Start with the 'animate' variant

  items = Array.from({ length: 6 }, (_, i) => i);

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
