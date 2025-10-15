import { Component } from '@angular/core';
import {  MotionDirective } from '../../directives/ngx-motion.directive';

@Component({
  selector: 'app-page-transition',
  imports: [MotionDirective],
  templateUrl: './page-transition.component.html',
  styleUrl: './page-transition.component.scss'
})
export class PageTransitionComponent {

}
