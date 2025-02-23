import { Component, OnInit, OnChanges, SimpleChanges ,Signal, computed} from '@angular/core';
import {  MotionDirective } from '../../directives/ngx-motion.directive';
import { PageTransitionComponent } from '../page-transition/page-transition.component';
import { MotionService } from '../services/motion.service';
import { gentleSpring1, gentleSpring2, gentleSpring3, gentleSpring4, moderateBounce1, moderateBounce2, moderateBounce3, moderateBounce4, strongBounce1, strongBounce2, strongBounce3, strongBounce4, elasticLike1, elasticLike2, elasticLike3, elasticLike4, overshoot1, overshoot2, overshoot3, overshoot4 } from '../../directives/spring-like-easings';

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

  strongBounce1 = elasticLike4;

  foodVariants: FoodVariants;
  activeVariant:Record<string, any>;
  animatedStyle: Signal<any> = computed(() => ({
    transform: `translateX(${this.scrollProgress}px)`
  }));

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
      // console.log('activeVariant',this.activeVariant);
      // console.log('status',this.status);
      // console.log('animatedStyle',this.animatedStyle);
  }

  changeStatus() {
    const keys = Object.keys(this.foodVariants);
    const currentIndex = keys.indexOf(this.status);
    const nextIndex = (currentIndex + 1) % keys.length;
    this.status = keys[nextIndex];
    //console.log('home status',this.status);
  }


  onAnimationComplete() {
    // Perform navigation or any other action after all exit animations are complete

    console.log("complete home");
  }
}
