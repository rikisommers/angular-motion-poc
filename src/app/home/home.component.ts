import { Component } from '@angular/core';
import {  MotionDirective } from '../../directives/ngx-motion.directive';
import { PageTransitionComponent } from '../page-transition/page-transition.component';
@Component({
  selector: 'app-home',
  imports: [MotionDirective,PageTransitionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isPanelOpen = false;


  togglePanel() {
    this.isPanelOpen = !this.isPanelOpen;
    console.log("toggle");

  }

  onAnimationComplete() {
    // Perform navigation or any other action after all exit animations are complete

    console.log("complete home");
  }
}
