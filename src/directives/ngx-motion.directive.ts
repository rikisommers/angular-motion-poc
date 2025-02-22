import {
  Directive,
  Input,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  Injector,
  InjectFlags,
  Renderer2
} from "@angular/core";
import {
  AnimationBuilder,
  style,
  animate,
  animateChild,
  AnimationPlayer,
  AnimationMetadata,
  AnimationOptions,
  keyframes,
  trigger,
  state,
  transition,
  AnimationEvent,
  stagger,
  query
} from "@angular/animations";
import { MotionService } from '../app/services/motion.service';

let uniqueIdCounter = 0; // Static counter for unique IDs

@Directive({
  selector: "[motion]",
  standalone: true,
})
export class MotionDirective implements OnDestroy, AfterViewInit, OnChanges {
  @Input() initial: any = {};
  @Input() animate: any = {};
  @Input() exit: any = {};
  @Input() inView: any = {};
  @Input() duration = "0.3s";
  @Input() delay = "0s";
  @Input() repeat = false;
  @Input() exitDelay = "0s"; 
  @Input() easing = "ease";
  @Input() offset = '0px';
  @Input() whileHover: any = {};
  @Input() staggerChildren = '0s';
  @Input() whileTap: any = {};
  @Input() whileFocus: any = {};
  @Input() whileInView: any = {};

  @Input() variants: any = {};

  @Output() animationComplete = new EventEmitter<void>();

  private player: AnimationPlayer | null = null;
  private elementId: string;
  private hoverTimeout: any;
  private injector: Injector;

  constructor(
    private builder: AnimationBuilder,
    private el: ElementRef, 
    private motionService: MotionService,
    injector: Injector,
    private renderer: Renderer2
  ) {
    // Generate a unique ID for this instance
    this.elementId = `motion-${uniqueIdCounter++}`;
    this.el.nativeElement.setAttribute('id', this.elementId); // Set the ID on the element

    this.motionService.registerMotionElement(this);
    this.applyInitialStyles();
    this.injector = injector;
  }

  get scrollProgress() {
    return this.motionService.scrollYProgress();
  }
  
  ngOnInit() {


    if (Object.keys(this.inView).length > 0) {
      this.runInitAnimationsWhenInViewport(this, this.offset, this.repeat);
    }

        this.playAnimation(this.initial, this.animate);

 
  }

  ngAfterViewInit() {
    // Apply initial styles


    // Check if the animate property is defined to trigger the animation

  }

  
  ngOnDestroy() {
    if (this.exit && Object.keys(this.exit).length > 0) {
      this.startExitAnimation(); 
    } 

    
    //TODO: Add options to select reset behaviour , e.g either reset tto inintial or allow anim to run
    // this.resetPlayer(); // Ensure the animation is properly cleaned up
    // this.reset();
   
    if (this.observer) {
      this.observer.disconnect();
    }
  }
  
  

  startEmterAnimation() {
    //console.log('Start Exiting...');

    if (this.player && this.player.hasStarted()) {
      this.player.destroy();
    }
  
    const delay = this.exitDelay || '0ms';
    const duration = this.duration || '0.3s';
    const easing = this.easing || 'ease';
    const timing = `${delay} ${duration} ${easing}`;
  
    const animation: AnimationMetadata[] = [
      style(this.initial), 
      animate(timing, style(this.animate))
    ];
  
    const animationBuilder = this.builder.build(animation);
    this.player = animationBuilder.create(this.el.nativeElement);
  
    this.player.onDone(() => {
      this.animationComplete.emit();
    });
  
    this.player.play();
  }


  startExitAnimation() {
      //console.log('Start Exiting...');
  
    if (this.player && this.player.hasStarted()) {
      this.player.destroy();
    }
  
    const delay = this.exitDelay || '0ms';
    const duration = this.duration || '0.3s';
    const easing = this.easing || 'ease';
    const timing = `${delay} ${duration} ${easing}`;
  
    const animation: AnimationMetadata[] = [
      style(this.animate), 
      animate(timing, style(this.exit))
    ];
  
    const animationBuilder = this.builder.build(animation);
    this.player = animationBuilder.create(this.el.nativeElement);
  
    this.player.onDone(() => {
      this.motionService.unregisterMotionElement(this);
      if (this.el.nativeElement.parentNode) {
        this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
      }
    });
  
    this.player.play();
  }

  applyInitialValues() {
    Object.assign(this.el.nativeElement.style, this.initial);

  }



  private resetPlayer() {
    if (this.player) {
      this.player.finish(); // Ensures the animation completes properly
      this.player.destroy();
    }
  }
  

  private reset() {
    this.resetPlayer(); // Stop and destroy animation  
    this.el.nativeElement.removeAttribute("style"); // Remove inline styles  
  }


  private applyInitialStyles() {
    Object.assign(this.el.nativeElement.style, this.initial);
  }

  private applyAnimateStyles() {
    Object.assign(this.el.nativeElement.style, this.animate);
  }

@HostListener('mouseenter')
onMouseEnter() {
  if (Object.keys(this.whileHover).length > 0) {
    clearTimeout(this.hoverTimeout);
    if(Object.keys(this.animate).length > 0){
      this.playAnimation(this.animate, this.whileHover);
    }else{
      this.playAnimation(this.initial, this.whileHover);
    }
  }
}

@HostListener('mouseleave')
onMouseLeave() {
  if (Object.keys(this.whileHover).length > 0) {
    this.hoverTimeout = setTimeout(() => {
      if(Object.keys(this.animate).length > 0){
        this.playAnimation(this.whileHover, this.animate);
      }else{
        this.playAnimation(this.whileHover, this.initial);
      }
    }, 100);
  }
}

// @HostListener('tap')
// onTap() {
//   if (Object.keys(this.whileTap).length > 0) {

//     if(Object.keys(this.animate).length > 0){
//       this.playAnimation(this.animate, this.whileTap);
//     }else{
//       this.playAnimation(this.initial, this.whileTap);
//     }
//   }
// }

// @HostListener('click')
// onClick() {
//   if (Object.keys(this.whileTap).length > 0) {
//     this.playAnimation(this.initial, this.whileTap);
//   }
// }

@HostListener('focus')
@HostListener('mousedown', ['$event'])
@HostListener('touchstart', ['$event'])
onPress(event: Event) {
  if (Object.keys(this.whileTap).length > 0) {
  if(Object.keys(this.animate).length > 0){
    this.playAnimation(this.animate, this.whileTap);
  }else{
    this.playAnimation(this.initial, this.whileTap);
  }
  const endEvent = event.type === 'mousedown' ? 'mouseup' : 'touchend';
  const endListener = () => {

      if(Object.keys(this.animate).length > 0){
        this.playAnimation(this.whileTap, this.animate);
      }else{
        this.playAnimation(this.whileTap, this.initial);
      }


    window.removeEventListener(endEvent, endListener);
  };

  window.addEventListener(endEvent, endListener);
}
}


@HostListener('focus')
onFocus() {
  if (Object.keys(this.whileFocus).length > 0) {
    if(Object.keys(this.animate).length > 0){
      this.playAnimation(this.animate, this.whileFocus);
    }else{
      this.playAnimation(this.initial, this.whileFocus);
    }
  }


}

@HostListener('blur')
onBlur() {
  if (Object.keys(this.whileFocus).length > 0) {
    if(Object.keys(this.animate).length > 0){
      this.playAnimation(this.whileFocus, this.animate);
    }else{
      this.playAnimation(this.whileFocus, this.initial);
    }
  }
}


  private setupHoverAnimations() {
    this.el.nativeElement.addEventListener('mouseenter', () => {
      if (this.whileHover) {
        clearTimeout(this.hoverTimeout);
        this.playAnimation(this.initial, this.whileHover);
      }
    });
  
    this.el.nativeElement.addEventListener('mouseleave', () => {
      if (this.whileHover) {
        this.hoverTimeout = setTimeout(() => {
          this.playAnimation(this.whileHover, this.initial);
        }, 100);
      }
    });

    this.el.nativeElement.addEventListener('tap', () => {
      if (this.whileTap) {
        this.playAnimation(this.initial, this.whileTap);
      }
    });

    this.el.nativeElement.addEventListener('click', () => {
      if (this.whileTap) {
        this.playAnimation(this.initial, this.whileTap);
      }
    });

    this.el.nativeElement.addEventListener('focus', () => {
      if (this.whileFocus) {
        this.playAnimation(this.initial, this.whileFocus);
      }
    });
  }

  /**
 * Helper method to get all MotionDirective instances inside the parent element.
 */
private getMotionChildren(): MotionDirective[] {
  return Array.from<Element>(this.el.nativeElement.querySelectorAll('[motion]'))
    .map((child: Element) => this.getMotionInstance(child))
    .filter((instance): instance is MotionDirective => instance !== null && instance.staggerChildren !== undefined);
}

/**
* Gets the MotionDirective instance from an element.
*/
private getMotionInstance(element: Element): MotionDirective | null {
  const injector = this.injector.get(Injector);
  return injector.get(MotionDirective, null, InjectFlags.Optional);
}


// Helper method to get the index of the current element among its siblings
private getChildIndex(): number | null {
  const parent = this.el.nativeElement.parentElement; // Get the parent element
  if (parent) {
    const siblings = Array.from(parent.children); // Get all the children (siblings)
    return siblings.indexOf(this.el.nativeElement); // Get the index of the current element
  }
  return null; // Return null if there is no parent
}

private parseAsNumber(value: any): number {
  const parsedValue = typeof value === 'string' 
    ? parseFloat(value) * 1000 
    : value;
  return isNaN(parsedValue) ? 0 : parsedValue;
}


  
// const motionChildren = this.getMotionChildren();
// console.log('motionChildren: ',motionChildren);

// const motionInstance = this.getMotionInstance(this.el.nativeElement);
// console.log('motionInstance: ',motionInstance?.elementId);

// const isElementIdInMotionChildren = motionChildren.some(child => child.elementId === motionInstance?.elementId);
// console.log('isElementIdInMotionChildren: ', isElementIdInMotionChildren);

// const parentElement = this.el.nativeElement.parentElement.querySelector('[motion]');
// const parentMotionInstance = this.getMotionInstance(parentElement);


  private playAnimation(startState: any, targetState: any) {

    if (!targetState) return;

    if(startState === undefined) {
      startState = this.initial;
    }

    if(targetState === undefined) {
      targetState = this.animate;
    }
    
    const delay = this.delay || '0ms';
    const duration = this.duration || '1s';
    const easing = this.easing || 'ease';

    
    if(typeof targetState === 'string') {
      targetState = this.variants[targetState];
    }

    if(typeof startState === 'string') {
      startState = this.variants[startState];
    }


    const timing = `${duration} ${delay} ${easing}`;

   
    const parentAnimation: AnimationMetadata[] = [
      style(startState || {}),
      animate(timing, style(targetState)),
    ];

    const animationBuilder = this.builder.build(parentAnimation);
    
    if (this.player && this.player.hasStarted()) {
        this.player.destroy();
    }
  
    this.player = animationBuilder.create(this.el.nativeElement);
    this.player.onDone(() => {
        this.animationComplete.emit();
    });
    this.player.play();

  }




  

  runInViewAnimation() {
    if (this.inView && this.animate) {
   //   console.log('running enter deep')
    this.playAnimation(this.initial, this.inView);
    }
  }

  runInitAnimation() {
    if (this.initial && this.animate) {
   //   console.log('running enter deep')
    this.playAnimation(this.initial, this.animate);
    }
  }

  // runExitAnimation() {
  //   if (this.exit) {
  //     console.log('running exit deep')
  //     this.playAnimation(this.animate, this.exit);
  //   }
  // }

  runExitAnimation() {
  
    if (this.exit) {
      
      this.playAnimation(this.animate, this.exit);
      this.animationComplete.emit();
    }
  }
  
  cancel() {
    this.applyAnimateStyles();
  }


  getDuration(): number {
    const durationSeconds = parseFloat(this.duration);
    const delaySeconds = parseFloat(this.delay);
    // Convert total duration to milliseconds
    return (durationSeconds + delaySeconds) * 1000;
  }





  

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['animate']) {
  //     const oldState = changes['animate'].previousValue;
  //     const newState = changes['animate'].currentValue;
  
  //     console.log('animate changed:', oldState, '→', newState);
  //     console.log('variants:', this.variants);
  //     console.log('initial:', this.initial);
  
  //     this.playAnimation(oldState, newState);
        
  //     // if (this.variants) {

  //     //   if (oldState !== undefined && this.variants[oldState]) {
  //     //     console.log('Old state:', this.variants[oldState]);
  //     //   } else {
  //     //     console.log('Old state is undefined or not in variants');
  //     //   }
  
  //     //   if (newState !== undefined && this.variants[newState]) {
  //     //     console.log('New state:', this.variants[newState]);
  //     //     this.playAnimation(this.initial, this.variants[newState]);
  //     //   } else {
  //     //     console.log('New state is undefined or not in variants');
  //     //   }
  //     // } else {
  //     //   console.warn('Variants object is undefined');
  //     // }
  //   }
  // }
  getKeyByValue(object:any, key:any) {
    return Object.keys(object).find(key =>
        object[key] === key);
}

  
ngOnChanges(changes: SimpleChanges) {
  if (changes['animate']) {
    const oldState = changes['animate'].previousValue;
    let newState = changes['animate'].currentValue;

    if (typeof newState === 'object') {
      // Animate based on updated properties
      this.playAnimation(oldState, newState);
    } else if (typeof newState === 'string' && this.variants?.[newState]) {
      // Resolve variant keys
      newState = this.variants[newState];
      this.playAnimation(oldState, newState);
    } else {
      this.playAnimation(oldState, newState);
    }
  }
}



  // animationStarted(event: AnimationEvent) {
  //   console.log('Animation started:', event);
  //   if (event.toState === 'void') {
  //     // Element is being removed - run exit animation
  //     this.runExitAnimation();
  //   } else if (event.fromState === 'void') {
  //     // Element is being added - apply initial styles then run entry animation
  //     this.applyInitialStyles();
  //     this.playAnimation(this.initial, this.animate);
  //   }
  // }

  // animationDone(event: AnimationEvent) {
  //   console.log('Animation done:', event);
  //   if (event.toState === 'void') {
  //     // Exit animation completed
  //     this.motionService.unregisterMotionElement(this);
  //   } else if (event.fromState === 'void' && event.toState !== 'void') {
  //     // Entry animation completed
  //     this.variant = 'animate';
  //   }
  //   this.animationComplete.emit();
  // }

  private observer?: IntersectionObserver;

//TODO:Add logic for exiting elements
  runInitAnimationsWhenInViewport(element: MotionDirective, offset: string = '0px', repeat: boolean) {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting ) {
          console.log('In view');
          element.runInViewAnimation();
  
          if (!repeat) {
            this.observer?.unobserve(entry.target);
          }
        } else if (!entry.isIntersecting && repeat) {
          console.log('Leaving view');
          
        }
      });
    }, { rootMargin: offset });
  
    this.observer.observe(element.el.nativeElement);
  }
  
}
