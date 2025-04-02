import { Component } from '@angular/core';
import { MotionOneDirective } from '../directives/motion-one.directive';
import { PageTransitionComponent } from '../components/transition/page-transition/page-transition.component';
@Component({
  selector: 'app-work',
  imports: [MotionOneDirective, PageTransitionComponent],
  standalone:true,
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss'
})
export class WorkComponent {

}
