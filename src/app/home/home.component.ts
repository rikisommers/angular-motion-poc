import { Component, OnInit } from '@angular/core';
import {  MotionDirective } from '../../directives/ngx-motion.directive';
import { PageTransitionComponent } from '../page-transition/page-transition.component';
import { MotionService } from '../services/motion.service';
type FoodVariants = Record<string, any>;

@Component({
  selector: 'app-home',
  imports: [MotionDirective,PageTransitionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isPanelOpen = false;


  status: string = "egg";

  foodVariants: FoodVariants;
  activeVariant:Record<string, any>;

  get scrollProgress() {
    return this.motionService.scrollYProgress();
  }


  constructor(private motionService: MotionService) {
    this.foodVariants = {
      hidden: { opacity: 0.5,transform: 'translateX(-100px)', backgroundColor: 'red' },
      egg: { opacity: 1, transform: 'translateX(0px)', backgroundColor: 'blue' },
      apple: { opacity: 1, transform: 'translateX(100px)', backgroundColor: 'green' },
      paste: { opacity: 0.5, transform: 'scale(0.8)', backgroundColor: 'yellow' }
    };
    this.status = 'egg';
    this.activeVariant = this.foodVariants[Object.keys(this.foodVariants)[1]];
  }





  ngOnInit() {
    console.log('activeVariant',this.activeVariant);
    console.log('status',this.status);
  }

  changeStatus() {
    const keys = Object.keys(this.foodVariants);
    const currentIndex = keys.indexOf(this.status);
    const nextIndex = (currentIndex + 1) % keys.length;
    this.status = keys[nextIndex];
    console.log('home status',this.status);
  }


  onAnimationComplete() {
    // Perform navigation or any other action after all exit animations are complete

    console.log("complete home");
  }
}
