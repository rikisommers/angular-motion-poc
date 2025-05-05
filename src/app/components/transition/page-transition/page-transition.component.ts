import { Component } from '@angular/core';
import { MotionOneDirective } from '../../../directives/motion-one.directive';
import { cubicBezier, spring } from 'motion';
@Component({
  selector: 'app-page-transition',
  imports: [MotionOneDirective],
  templateUrl: './page-transition.component.html',
  styleUrl: './page-transition.component.scss',
  standalone: true,
})
export class PageTransitionComponent {

}
