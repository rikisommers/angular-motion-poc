import { Component } from '@angular/core';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-timeline',
  imports: [MotionOneDirective],
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {

}
