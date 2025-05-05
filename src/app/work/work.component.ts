import { Component } from '@angular/core';
import { MotionOneDirective } from '../directives/motion-one.directive';
import { PageTransitionComponent } from '../components/transition/page-transition/page-transition.component';
import { LogoComponent } from "../components/motion/logo/logo.component";
@Component({
  selector: 'app-work',
  imports: [MotionOneDirective, PageTransitionComponent, LogoComponent],
  standalone:true,
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss'
})
export class WorkComponent {

}
