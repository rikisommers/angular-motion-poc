import { Component } from '@angular/core';
import { MotionOneDirective } from '../../../directives/motion-one.directive';
import { cubicBezier, spring } from 'motion';
@Component({
  selector: 'app-logo',
  imports: [MotionOneDirective],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {

}
