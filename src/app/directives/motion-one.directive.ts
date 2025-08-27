import {
  Directive,
  Input,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  HostListener,
  OnInit,
  PLATFORM_ID,
  Inject,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MotionOneService } from '../services/motion-one.service';
import { MotionAnimationService } from '../services/motion-animation.service';
import type { AnimationOptions, Target } from 'motion';
import { animate, easeIn, easeOut, easeInOut, stagger } from '../services/motion-browser-safe';

// Define interface for transition object similar to Framer Motion
export interface TransitionOptions {
  duration?: number;
  delay?: number;
  ease?: string | number[] | { type: 'spring'; stiffness?: number; damping?: number };
  repeat?: number | boolean;
  repeatType?: 'loop' | 'mirror' | 'reverse' | 'forwards' | 'pingPong';
  repeatDelay?: number;
  staggerChildren?: number;
  staggerDirection?: number;
  when?: 'beforeChildren' | 'afterChildren' | 'together';
  delayChildren?: number;
  times?: number[]; // keyframe times 0..1
}

// Define interface for variants that can include transition properties
export interface VariantWithTransition {
  [key: string]: any;
  transition?: TransitionOptions;
  at?: number; // Add 'at' property to define when variant should be triggered
}

// Optional timeline support for orchestrated per-property steps
export interface TimelineStep {
  prop: string;
  keyframes?: any[] | any;
  to?: any;
  duration: number;
  delay?: number;
  ease?: string | number[] | { type: 'spring'; stiffness?: number; damping?: number };
  atTime?: number; // absolute start (s) relative to element start
  times?: number[];
}

let uniqueIdCounter = 0; 

@Directive({
  selector: '[motionone]',
  standalone: true,
  exportAs: 'motionone'
})

export class MotionOneDirective implements OnInit, OnDestroy, OnChanges, AfterContentInit {
  @Input() initial: VariantWithTransition | string = {};
  @Input() animate: VariantWithTransition | string = {};
  @Input() exit: VariantWithTransition | string = {};
  @Input() inView: VariantWithTransition = {};
  @Input() duration = 0.3; // Changed to number for Motion One
  @Input() delay = 0; // Changed to number for Motion One
  @Input() delayChildren = 0; // Add new input for delaying children
  @Input() repeat = false;
  @Input() exitDelay = 0; // Changed to number for Motion One
  @Input() easing = 'ease';
  @Input() offset = '0px';
  @Input() whileHover: VariantWithTransition = {};
  @Input() staggerChildren = 1; // Changed to number for Motion One
  @Input() staggerDirection = 1; // Changed to number for Motion One
  @Input() whileTap: VariantWithTransition = {};
  @Input() whileFocus: VariantWithTransition = {};
  @Input() whileInView: VariantWithTransition = {};
  @Input() variants: { [key: string]: VariantWithTransition } = {};
  @Input() transition: TransitionOptions | Record<string, TransitionOptions> = {};  
  @Input() timeline: TimelineStep[] | undefined;
  @Output() animationComplete = new EventEmitter<void>();

  // Query for child motionone directives
  @ContentChildren(MotionOneDirective, { descendants: true }) childMotionDirectives!: QueryList<MotionOneDirective>;
  
  private controls: ReturnType<typeof animate> | null = null;
  private childrenControls: ReturnType<typeof animate>[] = [];
  public elementId: string;
  private hoverTimeout: any;
  private observer?: IntersectionObserver;
  private routeDelay: number = 0;
  private inViewInstance: any;
  private isChild = false;
  private parentDirective: MotionOneDirective | null = null;
  private initialAnimationPlayed = false;
  private staggerDelay = 0;
  private childrenCount = 0;
  private childIndex = 0;

  get scrollProgress() {
    return this.motionService.scrollYProgress();
  }

  constructor(
    public el: ElementRef,
    private motionService: MotionOneService,
    private motionAnimation: MotionAnimationService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.elementId = `motion-${uniqueIdCounter++}`;
    
    // Only run browser-specific code in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.el.nativeElement.setAttribute('id', this.elementId);
      // Store a reference to this directive on the element for easier access
      (this.el.nativeElement as any)._motionDirective = this;
      this.motionService.registerMotionElement(this);
      this.applyInitialStyles();
      this.routeDelay = this.motionService.getLongestExitDurationForRoute(this.router.url);
    }
  }

  ngOnInit() {
   // console.log(`[${this.elementId}] Initializing motionone directive`);
   this.applyInitialStyles(); // Ensure initial styles are applied

    // Only run animations in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Check if this is a child of another motionone directive
      let parent = this.el.nativeElement.parentElement;
      while (parent) {
        if (parent.hasAttribute('motionone')) {
          this.isChild = true;
      //    console.log(`[${this.elementId}] Detected as child of another motionone element: ${parent.id}`);
          break;
        }
        parent = parent.parentElement;
      }

    //  console.log(`[${this.elementId}] isChild=${this.isChild}, will ${!this.isChild ? 'auto-play' : 'wait for parent'}`);
      
      // Only auto-play animation if not a child of another motionone element
      if (!this.isChild) {
        this.playAnimation(this.initial, this.animate);

        // setTimeout(() => {
        // },2000);
      }
    }
  }

  ngAfterContentInit() {
    // Register child directives if we have staggerChildren
    if (this.childMotionDirectives && this.childMotionDirectives.length > 0) {
   //   console.log(`[${this.elementId}] Found ${this.childMotionDirectives.length} child directives`);
      
      // Set this directive as the parent for all children
      setTimeout(() => {
        // Filter out self from children
        const childDirectives = this.childMotionDirectives.filter(child => child !== this);
        this.childrenCount = childDirectives.length;
        
     //   console.log(`[${this.elementId}] After filtering self, found ${this.childrenCount} actual children`);
        
        // Set parent and index for each child
        childDirectives.forEach((child, index) => {
      //    console.log(`[${this.elementId}] Setting parent for child ${child.elementId} with index ${index}/${this.childrenCount}`);
          child.setParent(this, index, this.childrenCount);
        });
        
        // Check if we need to stagger children
        const staggerValue = this.getStaggerValue();
      //  console.log(`[${this.elementId}] Stagger value: ${staggerValue}, childrenCount: ${this.childrenCount}`);
        
        if (staggerValue > 0 && this.childrenCount > 0) {
      ///    console.log(`[${this.elementId}] Will apply stagger to children`);
          // Trigger staggered animations for children
          this.applyStaggerToChildren();
        } else {
      //    console.log(`[${this.elementId}] No stagger needed (staggerValue=${staggerValue}, childrenCount=${this.childrenCount})`);
        }
      });
    } else {
      //=    console.log(`[${this.elementId}] No child directives found`);
    }
  }

  setParent(parent: MotionOneDirective, index: number, totalChildren: number) {
    this.parentDirective = parent;
    this.isChild = true;
    this.childIndex = index;
    this.childrenCount = totalChildren;
  }

  // Method to stagger children animations
  applyStaggerToChildren() {
    // Get stagger configuration
    const staggerValue = this.getStaggerValue();
    const staggerDirection = this.getStaggerDirection();
    const delayChildren = this.delayChildren; // number
    const parentDelay = (((this.transition as TransitionOptions)?.delay) ?? 0) as number;
    
    // Get all child directives (excluding self)
    const childDirectives = this.childMotionDirectives.filter(child => child !== this);
    
    // Determine when to animate parent relative to children
    const when = this.getWhen();
    
    // Animate parent if needed
    if (when !== 'afterChildren') {
      this.runSelfAnimation();
    }
    
    // Animate each child with appropriate stagger delay
    childDirectives.forEach((childDirective, index) => {
      // Calculate the stagger delay based on index and direction
      let staggerIndex;
      if (staggerDirection >= 0) {
        staggerIndex = index;
      } else {
        staggerIndex = this.childrenCount - 1 - index;
      }
      
      // Combine parent delay, delayChildren, and stagger delay
      const totalDelay = (parentDelay as number) + delayChildren + (staggerIndex * staggerValue);
      
      this.logDebug(`Child ${childDirective.elementId} index=${index}, staggerIndex=${staggerIndex}, totalDelay=${totalDelay}`);
      
      // Force override the child's delay
      childDirective.overrideDelay(totalDelay);
      
      // Trigger the child's animation
      childDirective.runInitAnimation();
    });
    
    // Animate parent after children if specified
    if (when === 'afterChildren') {
      const totalChildrenDuration = (parentDelay as number) + delayChildren + (this.childrenCount * staggerValue);
      this.overrideDelay(totalChildrenDuration);
      this.runSelfAnimation();
    }
  }

  // Method to override the delay for this directive
  overrideDelay(delay: number) {
    //  console.log(`[${this.elementId}] Delay overridden: ${this.staggerDelay} -> ${delay}`);
    this.staggerDelay = delay;
  }

  // Run animation only for this element (not children)
  runSelfAnimation() {
    // Get animation options
    const options = this.getAnimationOptions();
    
    //  console.log(`[${this.elementId}] Running self animation with delay: ${options.delay}`);
    
    // Extract only style properties for animation
    const targetStyles = this.extractStyleProperties(this.getVariant(this.animate));
    
    // Apply start state immediately
    const startStyles = this.extractStyleProperties(this.getVariant(this.initial));
    Object.assign(this.el.nativeElement.style, startStyles);
    
    // Create animation
    this.controls = this.motionAnimation.animate(
      this.el.nativeElement as Target,
      targetStyles,
      options
    );
    
    this.initialAnimationPlayed = true;
  }

  ngOnDestroy() {

    
    if (this.exit && Object.keys(this.exit).length > 0) {
      this.runExitAnimation();
    }

    if (this.inViewInstance) {
      this.inViewInstance.stop();
    }

    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Clean up any ongoing animations
    if (this.controls) {
      this.controls.stop();
    }
    
    // Clean up any children animations
    this.childrenControls.forEach(control => {
      if (control) control.stop();
    });


   // this.motionService.unregisterMotionElement(this);
    //console.log(`[${this.elementId}] Unregistered motionone directive`);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['animate'] && changes['animate'].previousValue !== undefined) {
      const oldState = changes['animate'].previousValue;
      let newState = changes['animate'].currentValue;
      
      if (typeof newState === 'object') {
        this.playAnimation(oldState, newState);
      } else if (typeof newState === 'string' && this.variants?.[newState]) {
        newState = this.variants[newState];
        this.playAnimation(oldState, newState);
      } 
    }

    // Handle transition changes
    if (changes['transition'] && !changes['transition'].firstChange) {
      // Re-apply animation with new transition settings
      this.playAnimation(this.initial, this.animate);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (Object.keys(this.whileHover).length > 0) {
      clearTimeout(this.hoverTimeout);
      if (Object.keys(this.animate).length > 0) {
        this.playAnimation(this.animate, this.whileHover);
      } else {
        this.playAnimation(this.initial, this.whileHover);
      }
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (Object.keys(this.whileHover).length > 0) {
      this.hoverTimeout = setTimeout(() => {
        if (Object.keys(this.animate).length > 0) {
          this.playAnimation(this.whileHover, this.animate);
        } else {
          this.playAnimation(this.whileHover, this.initial);
        }
      }, 100);
    }
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onPress(event: Event) {
    if (Object.keys(this.whileTap).length > 0) {
      if (Object.keys(this.animate).length > 0) {
        this.playAnimation(this.animate, this.whileTap);
      } else {
        this.playAnimation(this.initial, this.whileTap);
      }
      
      // Only add event listeners in browser environment
      if (isPlatformBrowser(this.platformId)) {
        const endEvent = event.type === 'mousedown' ? 'mouseup' : 'touchend';
        const endListener = () => {
          if (Object.keys(this.animate).length > 0) {
            this.playAnimation(this.whileTap, this.animate);
          } else {
            this.playAnimation(this.whileTap, this.initial);
          }

          window.removeEventListener(endEvent, endListener);
        };

        window.addEventListener(endEvent, endListener);
      }
    }
  }

  @HostListener('focus')
  onFocus() {
    if (Object.keys(this.whileFocus).length > 0) {
      if (Object.keys(this.animate).length > 0) {
        this.playAnimation(this.animate, this.whileFocus);
      } else {
        this.playAnimation(this.initial, this.whileFocus);
      }
    }
  }

  @HostListener('blur')
  onBlur() {
    if (Object.keys(this.whileFocus).length > 0) {
      if (Object.keys(this.animate).length > 0) {
        this.playAnimation(this.whileFocus, this.animate);
      } else {
        this.playAnimation(this.whileFocus, this.initial);
      }
    }
  }

  applyInitialValues() {
    // Extract only style properties (exclude transition)
    const styles = this.extractStyleProperties(this.getVariant(this.initial));
    Object.assign(this.el.nativeElement.style, styles);
  }

  private applyInitialStyles() {
    // Extract only style properties (exclude transition)
    const styles = this.extractStyleProperties(this.getVariant(this.initial));
    
    // Apply initial styles immediately to prevent flash
    if (styles && Object.keys(styles).length > 0) {
      // Use requestAnimationFrame to ensure styles are applied before the element is visible
      // requestAnimationFrame(() => {
        Object.assign(this.el.nativeElement.style, styles);
      // });
    }
  }

  private applyAnimateStyles() {
    // Extract only style properties (exclude transition)
    const styles = this.extractStyleProperties(this.getVariant(this.animate));
    Object.assign(this.el.nativeElement.style, styles);
  }

  // Helper to extract only style properties from a variant (excluding transition)
  private extractStyleProperties(variant: VariantWithTransition): Record<string, any> {
    if (!variant) return {};
    
    const result: Record<string, any> = {};
    
    for (const key in variant) {
      // Allow raw transform strings or keyframe arrays to pass through untouched
      if (key === 'transform') {
        (result as any)['transform'] = (variant as any)[key];
        continue;
      }
      if (this.isTransformProperty(key)) {
        this.applyTransformProperty(result, key, variant[key]);
      } else if (key !== 'transition') {
        this.applyStyleProperty(result, key, variant[key]);
      }
    }
    
    this.normalizeTransformProperty(result);
    
    return result;
  }

  // Check if a property should be handled as a transform
  private isTransformProperty(key: string): boolean {
    return ['x', 'y', 'rotate', 'scale', 'scaleX', 'scaleY'].includes(key);
  }

  // Apply transform properties to the result object
  private applyTransformProperty(result: Record<string, any>, key: string, value: any): void {
    // If keyframe array is provided, let Motion One handle it directly
    if (Array.isArray(value)) {
      (result as any)[key] = value;
      return;
    }
    // Initialize transform matrix if it doesn't exist
    if (!result['transform']) {
      result['transform'] = 'matrix(1, 0, 0, 1, 0, 0)';
    }

    // Parse current matrix
    const currentMatrix = result['transform'].match(/matrix\((.*)\)/)[1].split(',').map(Number);
    
    // Create new matrix based on the transform type
    let newMatrix: number[];
    
    switch (key) {
      case 'x':
        newMatrix = [1, 0, 0, 1, value, 0];
        break;
      case 'y':
        newMatrix = [1, 0, 0, 1, 0, value];
        break;
      case 'rotate':
        const rad = (value * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        newMatrix = [cos, -sin, sin, cos, 0, 0];
        break;
      case 'scale':
        newMatrix = [value, 0, 0, value, 0, 0];
        break;
      case 'scaleX':
        newMatrix = [value, 0, 0, 1, 0, 0];
        break;
      case 'scaleY':
        newMatrix = [1, 0, 0, value, 0, 0];
        break;
      default:
        return;
    }

    // Multiply matrices
    const finalMatrix = this.multiplyMatrices(currentMatrix, newMatrix);
    
    // Apply the new matrix
    result['transform'] = `matrix(${finalMatrix.join(',')})`;
  }

  // Helper function to multiply two 2D matrices
  private multiplyMatrices(a: number[], b: number[]): number[] {
    return [
      a[0] * b[0] + a[2] * b[1],  // a
      a[1] * b[0] + a[3] * b[1],  // b
      a[0] * b[2] + a[2] * b[3],  // c
      a[1] * b[2] + a[3] * b[3],  // d
      a[0] * b[4] + a[2] * b[5] + a[4],  // e
      a[1] * b[4] + a[3] * b[5] + a[5]   // f
    ];
  }

  // Apply regular style properties to the result object
  private applyStyleProperty(result: Record<string, any>, key: string, value: any): void {
    if (this.isColorProperty(key)) {
      if (Array.isArray(value)) {
        result[key] = value.map(v => this.normalizeColor(v));
      } else {
        result[key] = this.normalizeColor(value);
      }
    } else {
      result[key] = value;
    }
  }

  // Check if a property is a color property
  private isColorProperty(key: string): boolean {
    return ['backgroundColor', 'color', 'borderColor'].includes(key);
  }

  // Normalize the transform property by trimming extra spaces
  private normalizeTransformProperty(result: Record<string, any>): void {
    if (result['transform']) {
      result['transform'] = result['transform'].trim();
    }
  }

  private getEasing(easingString: string | number[] | { type: 'spring'; stiffness?: number; damping?: number } | undefined) {
    if (!easingString) return this.motionAnimation.easeInOut;
    if (Array.isArray(easingString)) return easingString;
    if (typeof easingString === 'object' && 'type' in easingString && easingString.type === 'spring') {
      return this.motionAnimation.spring({
        stiffness: easingString.stiffness || 100,
        damping: easingString.damping || 10
      });
    }
    if (typeof easingString === 'string') {
      if (easingString === 'ease-in') return this.motionAnimation.easeIn;
      if (easingString === 'ease-out') return this.motionAnimation.easeOut;
      if (easingString === 'ease-in-out' || easingString === 'ease') return this.motionAnimation.easeInOut;
      if (easingString === 'spring') return this.motionAnimation.spring();
    }
    return this.motionAnimation.easeInOut;
  }

  private getAnimationOptions(targetState?: VariantWithTransition): AnimationOptions {
    // Priority: 1. Stagger delay, 2. State-specific transition, 3. Global transition, 4. Individual properties
    const stateTransition = (targetState?.transition as TransitionOptions) ?? (this.getVariant(this.animate)?.transition as TransitionOptions);
    const globalTransition = (this.transition as TransitionOptions);
    
    const transitionObj: TransitionOptions = stateTransition || globalTransition || {};
    
    // Always prioritize stagger delay over any other delay settings
    const delay = this.staggerDelay > 0 ? this.staggerDelay : (transitionObj.delay ?? this.delay);
    
    const easeInput = transitionObj.ease ?? this.easing;
    // If ease is a spring configuration, prefer native spring options (no fixed duration)
    if (easeInput && typeof easeInput === 'object' && 'type' in (easeInput as any) && (easeInput as any).type === 'spring') {
      const springOptions: any = {
        type: 'spring',
        stiffness: (easeInput as any).stiffness ?? 100,
        damping: (easeInput as any).damping ?? 10,
        delay,
        repeat: this.getRepeatValue(transitionObj),
        repeatDelay: transitionObj.repeatDelay,
        onComplete: () => this.animationComplete.emit()
      };
      return springOptions as AnimationOptions;
    }

    const ease = this.getEasing(easeInput as any);

    const options: any = {
      duration: transitionObj.duration ?? this.duration,
      delay,
      repeat: this.getRepeatValue(transitionObj),
      repeatDelay: transitionObj.repeatDelay,
      onComplete: () => this.animationComplete.emit()
    };
    const direction = this.mapRepeatTypeToDirection(transitionObj.repeatType);
    if (direction) options.direction = direction;
    if (transitionObj.repeatType) options.repeatType = transitionObj.repeatType;
    options.easing = ease; // Motion 11+
    (options as any).ease = ease; // Back-compat
    return options as AnimationOptions;
  }

  private getRepeatValue(transitionObj: TransitionOptions): number {
    // Handle repeat value from transition object or fallback to directive input
    if (transitionObj.repeat !== undefined) {
      if (transitionObj.repeat === true) {
        return Infinity;
      } else if (typeof transitionObj.repeat === 'number') {
        return transitionObj.repeat;
      }
    }
    
    return this.repeat ? Infinity : 0;
  }

  private mapRepeatTypeToDirection(
    repeatType: TransitionOptions['repeatType'] | undefined
  ): 'normal' | 'reverse' | 'alternate' | undefined {
    if (!repeatType) return undefined;
    // Aliases
    if (repeatType === 'forwards' || repeatType === 'loop') return 'normal';
    if (repeatType === 'reverse') return 'reverse';
    if (repeatType === 'pingPong' || repeatType === 'mirror') return 'alternate';
    // Default
    return 'normal';
  }

  private getStaggerValue(): number {
    // Priority: 1. State-specific transition, 2. Global transition, 3. Individual properties
    const stateTransition = this.getVariant(this.animate)?.transition as TransitionOptions;
    const globalTransition = this.transition as TransitionOptions;
    
    const transitionObj: TransitionOptions = stateTransition || globalTransition || {};
    
    // Get stagger value from transition object or fallback to directive input
    return transitionObj.staggerChildren ?? this.staggerChildren;
  }

  private getStaggerDirection(): number {
    // Priority: 1. State-specific transition, 2. Global transition, 3. Input property
    const stateTransition = this.getVariant(this.animate)?.transition as TransitionOptions;
    const globalTransition = this.transition as TransitionOptions;
    
    const transitionObj: TransitionOptions = stateTransition || globalTransition || {};
    
    return transitionObj.staggerDirection ?? this.staggerDirection;
  }

  private getWhen(): 'beforeChildren' | 'afterChildren' | 'together' {
    // Priority: 1. State-specific transition, 2. Global transition, 3. Default ('together')
    const stateTransition = this.getVariant(this.animate)?.transition as TransitionOptions;
    const globalTransition = this.transition as TransitionOptions;
    
    const transitionObj: TransitionOptions = stateTransition || globalTransition || {};
    
    return (transitionObj.when ?? 'together') as 'beforeChildren' | 'afterChildren' | 'together';
  }

  private playAnimation(startState: VariantWithTransition | string, targetState: VariantWithTransition | string) {
    if (!targetState || !isPlatformBrowser(this.platformId)) return;

    // Resolve variant strings to objects
    let resolvedStartState: VariantWithTransition = {};
    let resolvedTargetState: VariantWithTransition = {};

    if (startState === undefined) {
      resolvedStartState = this.getVariant(this.initial);
    } else if (typeof startState === 'string' && this.variants?.[startState]) {
      resolvedStartState = this.variants[startState];
    } else if (typeof startState === 'object') {
      resolvedStartState = startState;
    }

    if (targetState === undefined) {
      resolvedTargetState = this.getVariant(this.animate);
    } else if (typeof targetState === 'string' && this.variants?.[targetState]) {
      resolvedTargetState = this.variants[targetState];
    } else if (typeof targetState === 'object') {
      resolvedTargetState = targetState;
    }

    console.log('Playing animation with target state:', resolvedTargetState);

    // Check if target state has an 'at' property
    if (resolvedTargetState.at !== undefined) {
      console.log(`Scheduling animation to start in ${resolvedTargetState.at} seconds`);
      // Schedule the animation to start at the specified time
      setTimeout(() => {
        console.log('Executing delayed animation');
        this.continueAnimation(resolvedTargetState, false);
      }, resolvedTargetState.at * 1000); // Convert seconds to milliseconds
      return;
    }




    // // Stop any existing children animations
    // this.childrenControls.forEach(control => {
    //   if (control) control.stop();
    // });
    // this.childrenControls = [];

    // // Check if this is the initial animation to the animate state
    // const isInitialAnimation = 
    //   (targetState === this.animate || 
    //    (typeof targetState === 'string' && this.variants?.[targetState] === this.animate));

    // // Apply start state immediately (excluding transition property)
    // if (resolvedStartState) {
    //   const styles = this.extractStyleProperties(resolvedStartState);
      
    //   // Apply initial styles immediately to prevent flash
    //   if (styles && Object.keys(styles).length > 0) {
    //     // Use requestAnimationFrame to ensure styles are applied before animation starts
    //     requestAnimationFrame(() => {
    //       Object.assign(this.el.nativeElement.style, styles);
          
    //       // Use another requestAnimationFrame to ensure the next frame has the styles applied
    //       requestAnimationFrame(() => {
    //         // Continue with animation after styles are applied
    //         this.continueAnimation(resolvedTargetState, isInitialAnimation);
    //       });
    //     });
    //     return; // Exit early, animation will continue in the callback
    //   }
    // }
    
    // // If no start state or no styles to apply, continue immediately
    // this.continueAnimation(resolvedTargetState, isInitialAnimation);

    // Continue with normal animation if no 'at' property
    this.continueAnimation(resolvedTargetState, false);
  }

  private continueAnimation(resolvedTargetState: VariantWithTransition, isInitialAnimation: boolean) {
    // Timeline takes precedence
    if (this.timeline && this.timeline.length > 0) {
      this.runTimeline(resolvedTargetState);
      return;
    }

    // Detect per-property transition map on the state
    const t: any = resolvedTargetState.transition;
    const isPerPropMap = t && typeof t === 'object' && t.duration === undefined && t.delay === undefined && t.ease === undefined;
    if (isPerPropMap) {
      this.runPerPropertyAnimations(resolvedTargetState);
      return;
    }
    // Check if this is the initial animation to the animate state
    if (isInitialAnimation && !this.initialAnimationPlayed) {
      const staggerValue = this.getStaggerValue();
      
      if (staggerValue > 0 && this.childMotionDirectives && this.childMotionDirectives.length > 1) {
        // Stagger will be handled by ngAfterContentInit
        // Just animate self according to 'when' property
        const when = this.getWhen();
        
        if (when !== 'afterChildren') {
          this.runSelfAnimation();
        }
        
        return;
      }
    }

    // For non-staggered animations or non-initial animations
    // Get animation options with priority to target state's transition
    const options = this.getAnimationOptions(resolvedTargetState);
    
    // Extract only style properties for animation (excluding transition)
    const targetStyles = this.extractStyleProperties(resolvedTargetState);
    
    // Create animation with Motion One for the element itself
    this.controls = this.motionAnimation.animate(
      this.el.nativeElement as Target,
      targetStyles,
      options
    );
    
    if (isInitialAnimation) {
      this.initialAnimationPlayed = true;
    }
    
    // Handle regular DOM children (without motionone directives) for non-initial animations
    if (!isInitialAnimation && this.el.nativeElement.children.length > 0) {
      // Get children elements
      const children = Array.from(this.el.nativeElement.children) as HTMLElement[];
      
      // Animate each child with the same animation
      children.forEach((child) => {
        // Skip children that have their own motionone directive
        if (child.hasAttribute('motionone')) {
          return;
        }
        
        // Create child animation
        const childControl = this.motionAnimation.animate(
          child,
          targetStyles,
          options
        );
        
        // Store the control for cleanup
        this.childrenControls.push(childControl);
      });
    }
  }

  private runPerPropertyAnimations(resolvedTargetState: VariantWithTransition) {
    const baseDelay = this.staggerDelay > 0 ? this.staggerDelay : (((resolvedTargetState.transition as TransitionOptions)?.delay) ?? this.delay);
    const transitionMap = resolvedTargetState.transition as Record<string, TransitionOptions>;
    const props = Object.keys(resolvedTargetState).filter(k => k !== 'transition' && k !== 'at');

    let maxEnd = 0;
    props.forEach((prop) => {
      const value = (resolvedTargetState as any)[prop];
      const conf = (transitionMap?.[prop] || {}) as TransitionOptions;
      const delay = baseDelay + (conf.delay ?? 0);
      const ease = this.getEasing(conf.ease ?? this.easing);
      const duration = conf.duration ?? this.duration;
      const options: any = { duration, delay, easing: ease, repeat: this.getRepeatValue(conf), repeatDelay: conf.repeatDelay };
      (options as any).ease = ease;
      const dir = this.mapRepeatTypeToDirection(conf.repeatType);
      if (dir) options.direction = dir;
      if (conf.repeatType) options.repeatType = conf.repeatType;
      const times = (conf as any).times as number[] | undefined;
      if (times && Array.isArray(times)) options.offset = this.normalizeTimes(times, duration);

      const end = delay + duration;
      if (end > maxEnd) maxEnd = end;

      let finalValue = value;
      if (this.isColorProperty(prop)) {
        if (Array.isArray(value)) finalValue = value.map(v => this.normalizeColor(v));
        else finalValue = this.normalizeColor(value);
      }
      const target = { [prop]: finalValue } as any;
      const control = this.motionAnimation.animate(this.el.nativeElement as Target, target, options);
      this.childrenControls.push(control);
    });

    setTimeout(() => this.animationComplete.emit(), maxEnd * 1000);
  }

  private runTimeline(resolvedTargetState: VariantWithTransition) {
    const baseDelay = this.staggerDelay > 0 ? this.staggerDelay : (((resolvedTargetState.transition as TransitionOptions)?.delay) ?? this.delay);
    let maxEnd = 0;
    // Also animate any non-timeline props from the target state (e.g., opacity)
    const timelinePropsSet = new Set((this.timeline || []).map(s => s.prop));
    const nonTimelineTarget: any = {};
    Object.keys(resolvedTargetState).forEach(k => {
      if (k === 'transition' || k === 'at') return;
      if (!timelinePropsSet.has(k)) nonTimelineTarget[k] = (resolvedTargetState as any)[k];
    });
    if (Object.keys(nonTimelineTarget).length > 0) {
      const opt = this.getAnimationOptions(resolvedTargetState) as any;
      const ctl = this.motionAnimation.animate(this.el.nativeElement as Target, nonTimelineTarget, opt);
      this.childrenControls.push(ctl);
      const nonEnd = (opt.delay ?? 0) + (opt.duration ?? this.duration);
      if (nonEnd > maxEnd) maxEnd = nonEnd;
    }
    this.timeline!.forEach(step => {
      const start = baseDelay + (step.atTime ?? 0) + (step.delay ?? 0);
      const duration = step.duration;
      const value = step.keyframes !== undefined ? step.keyframes : step.to;
      const ease = this.getEasing(step.ease ?? this.easing);
      const options: any = { duration, delay: start, easing: ease };
      (options as any).ease = ease;
      if (step.times) options.offset = this.normalizeTimes(step.times, duration);

      const end = start + duration;
      if (end > maxEnd) maxEnd = end;

      let v = value;
      if (this.isColorProperty(step.prop)) {
        if (Array.isArray(v)) v = v.map((c: any) => this.normalizeColor(c));
        else v = this.normalizeColor(v);
      }
      const target = { [step.prop]: v } as any;
      const control = this.motionAnimation.animate(this.el.nativeElement as Target, target, options);
      this.childrenControls.push(control);
    });

    setTimeout(() => this.animationComplete.emit(), maxEnd * 1000);
  }

  // private setupInViewAnimation() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.inViewInstance = inView(
  //       this.el.nativeElement,
  //       (info) => {
  //         if (info.isInView) {
  //           this.runInViewAnimation();
  //           if (!this.repeat) {
  //             info.stop();
  //           }
  //         } else if (!info.isInView && this.repeat) {
  //           Object.assign(this.el.nativeElement.style, this.initial);
  //         }
  //       },
  //       {
  //         margin: this.offset as `${MarginValue}`,
  //         amount: 'some'
  //       }
  //     );
  //   }
  // }

  runInViewAnimation() {
    if (this.inView && Object.keys(this.inView).length > 0) {
      this.playAnimation(this.initial, this.inView);
    }
  }

  runInitAnimation() {
    if (!isPlatformBrowser(this.platformId) || !this.initial || !this.animate) return;
    
    // For child elements with stagger, make sure we use the stagger delay
    if (this.isChild && this.staggerDelay > 0) {
      //  console.log(`[${this.elementId}] Running staggered init animation with delay: ${this.staggerDelay}`);
      
      // Apply start state immediately
      const startStyles = this.extractStyleProperties(this.getVariant(this.initial));
      Object.assign(this.el.nativeElement.style, startStyles);
      
      // Get animation options with stagger delay
      const options = this.getAnimationOptions();
      //  console.log(`[${this.elementId}] Animation options:`, options);
      
      // Extract only style properties for animation
      const targetStyles = this.extractStyleProperties(this.getVariant(this.animate));
      
      // Create animation with stagger delay
      this.controls = this.motionAnimation.animate(
        this.el.nativeElement as Target,
        targetStyles,
        options
      );
      
      this.initialAnimationPlayed = true;
    } else {
      // Normal animation without stagger
        console.log(`[${this.elementId}] Running normal init animation, isChild=${this.isChild}, staggerDelay=${this.staggerDelay}, routeDelay=${this.routeDelay}`);

        this.playAnimation(this.initial, this.animate);

      // setTimeout(() => {
      //   this.playAnimation(this.initial, this.animate);
      // }, this.routeDelay);

    }
  }


  runExitAnimation(): Promise<void> {
    
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }
    
    // If no exit animation defined, resolve immediately
    if (!this.exit || Object.keys(this.exit).length === 0) {
     // console.log(`[${this.elementId}] No exit animation defined, resolving immediately`);
      return Promise.resolve();
    }
    
    console.log(`[${this.elementId}] Running exit animation`);
    
    // Use exit-specific transition if available, otherwise use global transition
    const exitTransition = (this.getVariant(this.exit).transition as TransitionOptions) || (this.transition as TransitionOptions) || {} as TransitionOptions;
    
    // Create a promise that resolves when the exit animation completes
    return new Promise<void>((resolve) => {
      const exitOptions: any = {
        duration: (exitTransition.duration ?? this.duration) as number,
        delay: (exitTransition.delay ?? this.exitDelay) as number,
        onComplete: () => {
     //     console.log(`[${this.elementId}] Exit animation completed`);
          this.animationComplete.emit();
          resolve();
        }
      };
      const ease = this.getEasing(exitTransition.ease ?? this.easing);
      exitOptions.easing = ease;
      (exitOptions as any).ease = ease;
      
      // Stop any existing animation
      if (this.controls) {
        this.controls.stop();
      }
      
      // Stop any existing children animations
      this.childrenControls.forEach(control => {
        if (control) control.stop();
      });
      
      // Extract only style properties for animation (excluding transition)
      const exitStyles = this.extractStyleProperties(this.getVariant(this.exit));
      
  //    console.log(`[${this.elementId}] Starting exit animation with styles:`, exitStyles);
      
      // Create exit animation
     // console.log('animatiing exit')

      this.controls = this.motionAnimation.animate(
        this.el.nativeElement as Target,
        exitStyles,
        exitOptions
      );
      
      // If no duration is set, resolve immediately
      if (!exitOptions.duration) {
       // console.log(`[${this.elementId}] No duration set, resolving immediately`);
        resolve();
      }
    });
  }

  cancel() {
    if (this.controls) {
      this.controls.stop();
    }
    
    // Cancel any children animations
    this.childrenControls.forEach(control => {
      if (control) control.stop();
    });
    
    this.applyAnimateStyles();
  }

  getDuration(): number {
    if (!isPlatformBrowser(this.platformId)) return 0;
    
    try {
      // Consider state-specific transition if available
      // Check transitions in order of priority: exit, animate, then default transition
      const animateTransition = (this.getVariant(this.exit)?.transition as TransitionOptions) || (this.transition as TransitionOptions) || {} as TransitionOptions;
      const duration = (animateTransition.duration ?? this.duration) as number;
      const delay = (animateTransition.delay ?? this.delay) as number;
      return (Number(duration) + Number(delay)) * 1000;
    } catch (error) {
      console.error('Error calculating duration:', error);
      return 0;
    }
  }

  getKeyByValue(object: any, key: any) {
    return Object.keys(object).find((k) => object[k] === key);
  }

  // Helper method for consistent logging
  private logDebug(message: string) {
    // Log to console
    //console.log(`[${this.elementId}] ${message}`);
    
    // Only add DOM elements in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Add a visible element to the DOM for debugging (if needed)
      // Uncomment this section if you need visual debugging
      /*
      const debugEl = document.createElement('div');
      debugEl.style.position = 'fixed';
      debugEl.style.top = '10px';
      debugEl.style.right = '10px';
      debugEl.style.backgroundColor = 'rgba(0,0,0,0.8)';
      debugEl.style.color = 'white';
      debugEl.style.padding = '5px';
      debugEl.style.zIndex = '9999';
      debugEl.style.maxWidth = '80%';
      debugEl.style.maxHeight = '80%';
      debugEl.style.overflow = 'auto';
      debugEl.textContent = `[${this.elementId}] ${message}`;
      document.body.appendChild(debugEl);
      
      // Remove after 5 seconds
      setTimeout(() => {
        document.body.removeChild(debugEl);
      }, 5000);
      */
    }
  }

  // Helper to normalize color values to a consistent format
  private normalizeColor(color: any): string {
    if (color == null) return '';
    if (typeof color !== 'string') {
      try { return String(color); } catch { return ''; }
    }
    if (color.startsWith('rgb') || color.startsWith('#')) return color;
    if (color === 'aqua') return '#00ffff';
    if (color === 'red') return '#ff0000';
    if (color === 'blue') return '#0000ff';
    if (color === 'green') return '#008000';
    if (color === 'yellow') return '#ffff00';
    if (color === 'purple') return '#800080';
    if (color === 'orange') return '#ffa500';
    if (color === 'black') return '#000000';
    if (color === 'white') return '#ffffff';
    return color;
  }

  private normalizeTimes(times: number[] | undefined, duration: number): number[] | undefined {
    if (!times || times.length === 0) return undefined;
    const hasSeconds = times.some(t => t > 1);
    if (!hasSeconds) return times;
    const safeDuration = Math.max(duration, 0.000001);
    return times.map(t => {
      const v = t / safeDuration;
      return v < 0 ? 0 : v > 1 ? 1 : v;
    });
  }

  // Add a method to manually trigger exit animation from outside
  public triggerExitAnimation(): Promise<void> {
   // console.log(`[${this.elementId}] Manually triggering exit animation`);
    return this.runExitAnimation();
  }

  // Add a listener for the custom exit event
  @HostListener('motionExit')
  onMotionExit() {
  //  console.log(`[${this.elementId}] Received motionExit event`);
    this.runExitAnimation();
  }

  private getVariant(variant: VariantWithTransition | string): VariantWithTransition {
    if (typeof variant === 'string') {
      return this.variants[variant] || {};
    } else if (typeof variant === 'object') {
      return variant;
    } else {
      throw new Error('Invalid variant format');
    }
  }
}
