import { Component } from '@angular/core';
import {  MotionDirective } from '../../directives/ngx-motion.directive';
import { PageTransitionComponent } from '../page-transition/page-transition.component';
@Component({
  selector: 'app-work',
  imports: [MotionDirective, PageTransitionComponent],
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss'
})
export class WorkComponent {
  isPanelOpen = false;

  togglePanel() {
    this.isPanelOpen = !this.isPanelOpen;
    console.log("toggle");

  }

  onAnimationComplete() {
    // Perform navigation or any other action after all exit animations are complete

    console.log("complete work");
  }

}
