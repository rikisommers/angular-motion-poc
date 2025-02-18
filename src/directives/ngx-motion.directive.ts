import {
  Directive,
  Input,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import {
  AnimationBuilder,
  style,
  animate,
  AnimationPlayer,
  AnimationMetadata,
  AnimationOptions,
  keyframes,
  trigger,
  state,
  transition,
  AnimationEvent
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
  @Input() duration = "0.3s";
  @Input() delay = "0s";
  @Input() exitDelay = "0s"; // New exit delay input
  @Input() easing = "ease";
  @Input() whileHover: any = {};
  @Input() variant: string = '';

  @Output() animationComplete = new EventEmitter<void>();

  private player: AnimationPlayer | null = null;
  private elementId: string;

  constructor(
    private builder: AnimationBuilder,
    private el: ElementRef, 
    private motionService: MotionService
  ) {
    // Generate a unique ID for this instance
    this.elementId = `motion-${uniqueIdCounter++}`;
    this.el.nativeElement.setAttribute('id', this.elementId); // Set the ID on the element
    this.motionService.registerMotionElement(this);
    this.applyInitialStyles();
  }

  ngOnInit() {


    // Initialize hover animations if defined
    if (Object.keys(this.whileHover).length > 0) { 
      this.setupHoverAnimations();
    }

    if (Object.keys(this.animate).length > 0) {
      setTimeout(() => {
        this.playAnimation(this.initial, this.animate);
      },1000);
    }
  }

  ngAfterViewInit() {
    // Apply initial styles


    // Check if the animate property is defined to trigger the animation

  }

  ngOnDestroy() {
    
    if (this.exit && Object.keys(this.exit).length > 0) {
      this.startExitAnimation();
    }
    
  }
  

  startEmterAnimation() {
    console.log('Start Exiting...');
  
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
    console.log('Start Exiting...');
  
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

  private applyInitialStyles() {
    Object.assign(this.el.nativeElement.style, this.initial);
  }

  private applyAnimateStyles() {
    Object.assign(this.el.nativeElement.style, this.animate);
  }

  private setupHoverAnimations() {
    
      this.el.nativeElement.addEventListener('mouseenter', () => {
        this.playAnimation(this.initial, this.whileHover);
      });

      this.el.nativeElement.addEventListener('mouseleave', () => {
        this.playAnimation(this.whileHover, this.initial);
      });
  }


  private playAnimation(startState: any, targetState: any) {
    const delay = this.delay || '0ms'; // Default to 0ms if no delay is provided
    const duration = this.duration || '1s'; // Default duration
    const easing = this.easing || 'ease'; // Default easing
  
    const timing = `${duration} ${delay} ${easing}`; // Correct animation timing string
  
   // console.log('Animation timing:', timing); // Debug output
  
    const animation: AnimationMetadata[] = [
      style(startState),
      animate(timing, style(targetState))
    ];
  
    const animationBuilder = this.builder.build(animation);
  
    if (this.player && this.player.hasStarted()) {
      this.player.destroy(); // Destroy previous player if it exists
    }
  
    this.player = animationBuilder.create(this.el.nativeElement);
    this.player.onDone(() => {
      this.animationComplete.emit(); // Emit event on animation completion
    });
    this.player.play();
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['variant'] && !changes['variant'].firstChange) {
        const previousVariant = changes['variant'].previousValue; // Get the previous variant
        const currentVariant = this.variant; // Get the current variant

        let startState: any;
        let targetState: any;

        // Determine the start and target states based on the previous and current variants
        if (previousVariant === 'initial' && currentVariant === 'animate') {
            startState = this.initial;
            targetState = this.animate;
        } else if (previousVariant === 'animate' && currentVariant === 'exit') {
            startState = this.animate;
            targetState = this.exit;
        } else if (previousVariant === 'exit' && currentVariant === 'initial') {
            startState = this.exit;
            targetState = this.initial;
        } else if (previousVariant === 'animate' && currentVariant === 'initial') {
            startState = this.animate;
            targetState = this.initial;
        } else if (previousVariant === 'exit' && currentVariant === 'animate') {
            startState = this.exit;
            targetState = this.animate;
        } else {
            // If no valid transition, do nothing
            return;
        }

        // Use the runAnimation method to handle the animation logic
        this.playAnimation(startState, targetState);
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
}
