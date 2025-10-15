import { Component } from '@angular/core';
import { MotionOneDirective } from '../directives/motion-one.directive';

@Component({
  selector: 'app-timeline',
  imports: [MotionOneDirective],
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {

}
