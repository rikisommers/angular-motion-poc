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
  InjectFlags
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
  @Input() exitDelay = "0s"; // New exit delay input
  @Input() easing = "ease";
  @Input() offset = '0px';
  @Input() whileHover: any = {};
  @Input() staggerChildren = '';
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
    injector: Injector
  ) {
    // Generate a unique ID for this instance
    this.elementId = `motion-${uniqueIdCounter++}`;
    this.el.nativeElement.setAttribute('id', this.elementId); // Set the ID on the element
    this.motionService.registerMotionElement(this);
    this.applyInitialStyles();
    this.injector = injector;
  }

  ngOnInit() {


    // Initialize hover animations if defined
    // if (Object.keys(this.whileHover).length > 0) { 
    //   this.setupHoverAnimations();
    // }
    if (Object.keys(this.inView).length > 0) {
      this.runInitAnimationsWhenInViewport(this, this.offset, this.repeat);
    }

    // if (Object.keys(this.animate).length > 0 && this.variants) {
    // //  console.log('animatedddd: ',this.animate, typeof this.animate );
    //   if (typeof this.animate === 'string') {
    // //    console.log(`Ini tvariant "${this.animate}" to:`, this.variants[this.animate]);
    //     setTimeout(() => {

    //       this.playAnimation(this.initial, this.variants[this.animate]);
    //     },0);
       
    //    } else if (typeof animate === 'object') {
    //     console.warn(`Init animate "${animate}"`);
    //     setTimeout(() => {
    //     this.playAnimation(this.initial, this.animate);
    //   },0);
    //  }
   

    // }
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




  private playAnimation(startState: any, targetState: any) {
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
  
    const motionChildren = this.getMotionChildren();
    console.log('motionChildren: ',motionChildren);
    

    const staggerDelay = typeof this.staggerChildren === 'string' 
    ? parseFloat(this.staggerChildren) * 1000 
    : this.staggerChildren;

    let timing = '';
    if(this.staggerChildren && motionChildren.length > 0){
      const index = this.getChildIndex();
      console.log('index: ',index ? index + 1 : 0);
      timing = `${duration} ${(index ? index  + 1 : 0) * staggerDelay}ms ${easing}`;
    }else{
      timing = `${duration} ${delay} ${easing}`;
    }





        // Define parent animation
        const parentAnimation: AnimationMetadata[] = [
          style(startState),
          animate(timing, style(targetState)),
   
      ];


    // const staggerDelay = typeof this.staggerChildren === 'string' 
    // ? parseFloat(this.staggerChildren) * 1000 
    // : this.staggerChildren;


                // animateChild({
          //   delay: this.staggerChildren, // Apply stagger delay to child animations
          // }),
        //   query('[motion]', [
        //     stagger(this.staggerChildren, [
        //         style({ opacity: 0, transform: 'translateY(100px)' }),
        //         animate(`${duration} ease-in-out`, style({ opacity: 1, transform: 'translateY(0px)' }))
        //     ])
        // ], { optional: true })
      const animationBuilder = this.builder.build(parentAnimation);

      // if(motionChildren.length > 0){

      //   const staggerDelay = typeof this.staggerChildren === 'string' 
      //   ? parseFloat(this.staggerChildren) * 1000 
      //   : this.staggerChildren;
      
      //     motionChildren.forEach((child, index) => {
      //       const childInitial = child.initial || {};
      //       const childAnimate = child.animate || {};
      //       const childDuration = child.duration || duration;
      
      //       console.log('childDuration: ',childDuration);
      //       console.log('childAnimate: ',childAnimate);
      //       console.log('childInitial: ',childInitial);
      //       console.log('staggerDelay: ',`${index * staggerDelay}ms`);
      
      //       const childAnimation: AnimationMetadata[] = [
      //           style(childInitial),
      //           animate(`${childDuration} ${index * staggerDelay}ms ${easing}`, style(childAnimate))
      //       ];
      
      //       const childAnimationBuilder = this.builder.build(childAnimation);
      //       const childPlayer = childAnimationBuilder.create(child.el.nativeElement);
      //       childPlayer.play();
       
      //     });
      
      // }


    // const animation: AnimationMetadata[] = [
    //   style(startState),
    //   animate(timing, style(targetState)),

      //stagger('1s', [animateChild()]),
    //   query('[motion]', [
    //     stagger(staggerDelay, [
    //         style({ opacity: 0, transform: 'translateY(10px)' }),
    //         animate(`${duration} ease-in-out`, style({ opacity: 1, transform: 'translateY(0px)' }))
    //     ])
    // ], { optional: true })
       //query('@animate', stagger(staggerDelay, [animateChild()]), { optional: true })

      
    //s];

  
    //const animationBuilder = this.builder.build(animation);
  
    if (this.player && this.player.hasStarted()) {
        this.player.destroy();
    }
  
    this.player = animationBuilder.create(this.el.nativeElement);
    this.player.onDone(() => {
        this.animationComplete.emit();
    });
    this.player.play();



  //   const motionChildren: HTMLElement[] = Array.from(this.el.nativeElement.querySelectorAll('[motion]'));
  //   console.log('motionChildren: ',motionChildren);

  //   motionChildren.forEach((child, index) => {
  //     const childAnimation: AnimationMetadata[] = [
  //         style(this.initial),
  //         animate(`${duration} ${index * staggerDelay}ms ${easing}`, style(this.animate))
  //     ];

  //     const childAnimationBuilder = this.builder.build(childAnimation);
  //     const childPlayer = childAnimationBuilder.create(child);
  //     childPlayer.play();
  // });


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
  
        // console.log('animate changed:', oldState, '→', newState);
        // console.log('variants:', this.variants);
        // console.log('initial:', this.initial);
      

      if(this.variants) {
      //  console.log(this.variants);
        let newState = changes['animate'].currentValue;
      //  console.log('variant string: ',newState);

        const keys = Object.keys(this.variants);
        const currentValue = keys.indexOf(this.variants[newState]);
       // console.log('currentValue: ',currentValue);
       // console.log('keys: ',keys);
      }else{
       // console.warn('No variants found');
      }

      // Check if `newState` is a key in `variants`
      if (typeof newState === 'string' && this.variants?.[newState]) {
       // console.log(`Resolved variant key "${newState}" to:`, this.variants[newState]);

        newState = this.variants[newState]; // Assign the actual variant values
        this.playAnimation(oldState, newState);
      } else if (typeof newState === 'string') {
//        console.warn(`Variant key "${newState}" not found in variants.`);
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
