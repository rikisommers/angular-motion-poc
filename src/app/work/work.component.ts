import { Component } from '@angular/core';
<<<<<<< HEAD
import {  MotionDirective } from '../../directives/ngx-motion.directive';
import { PageTransitionComponent } from '../page-transition/page-transition.component';
@Component({
  selector: 'app-work',
  imports: [MotionDirective, PageTransitionComponent],
=======
import { MotionOneDirective } from '../directives/motion-one.directive';
import { PageTransitionComponent } from '../components/transition/page-transition/page-transition.component';
import { LogoComponent } from "../components/motion/logo/logo.component";
@Component({
  selector: 'app-work',
  imports: [MotionOneDirective, PageTransitionComponent, LogoComponent],
  standalone:true,
>>>>>>> final
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss'
})
export class WorkComponent {
<<<<<<< HEAD
  isPanelOpen = false;

  togglePanel() {
    this.isPanelOpen = !this.isPanelOpen;
    console.log("toggle");

  }

  onAnimationComplete() {
    // Perform navigation or any other action after all exit animations are complete

    console.log("complete work");
  }
=======
>>>>>>> final

}
