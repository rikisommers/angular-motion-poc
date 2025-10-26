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
import { animate, easeIn, easeOut, easeInOut, stagger, inView } from '../services/motion-browser-safe';

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
  repeat?: number | boolean;
  repeatType?: 'loop' | 'mirror' | 'reverse' | 'forwards' | 'pingPong';
  repeatDelay?: number;
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
  @Input() easing: string | number[] | { type: 'spring'; stiffness?: number; damping?: number } = 'ease';
  @Input() offset = '0px';
  @Input() whileHover: VariantWithTransition = {};
  @Input() staggerChildren = 1; // Changed to number for Motion One
  @Input() staggerDirection = 1; // Changed to number for Motion One
  @Input() whileTap: VariantWithTransition = {};
  @Input() whileFocus: VariantWithTransition = {};
  @Input() whileInView: VariantWithTransition = {};
  @Input() runInView?: 'never' | 'once' | 'always'; // Controls if animation waits for inView ('never'/undefined = immediate, 'once' = single trigger, 'always' = repeats on scroll)
  @Input() variants: { [key: string]: VariantWithTransition } = {};
  @Input() transition: TransitionOptions | Record<string, TransitionOptions> = {};
  @Input() timeline: TimelineStep[] | undefined;
  @Output() animationComplete = new EventEmitter<void>();


  // Add a public method to restart animations
  public restartAnimation() {
    console.log('[MotionOne] Restarting animation for:', this.elementId);

    // Stop any current animations
    if (this.controls) {
      this.controls.stop();
    }

    // Force reset to initial state immediately without animation
    const initialVariant = this.getVariant(this.initial);
    const initialStyles = this.extractStyleProperties(initialVariant);

    // Apply initial styles directly with no transition
    const element = this.el.nativeElement;
    element.style.transition = 'none';
    Object.assign(element.style, initialStyles);

    // Force a reflow to ensure the reset is applied
    element.offsetHeight;

    // Remove the transition override and start the animation fresh
    setTimeout(() => {
      element.style.transition = '';

      // Check if this element uses runInView
      if (this.isRunInViewEnabled) {
        // For runInView elements, just reset to initial and let inView handle the animation
        console.log('[MotionOne] Retrigger for runInView element - resetting to initial state');
        // Element is already reset to initial, inView will trigger when appropriate
      } else {
        // For non-runInView elements, play the animation directly
        console.log('[MotionOne] Retrigger for normal element - playing animation');
        this.playAnimation(this.initial, this.animate);
      }
    }, 10);
  }

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
  private _skipStartStylesApplication = false;
  private staggerDelay: number | undefined = undefined;
  private childrenCount = 0;
  private childIndex = 0;
  private isStaggeredChild = false; // Flag to indicate if this child is part of a stagger group

  get scrollProgress() {
    return this.motionService.scrollYProgress();
  }

  // Helper methods for runInView configuration
  private get isRunInViewEnabled(): boolean {
    return this.runInView === 'once' || this.runInView === 'always';
  }

  private get runInViewRepeat(): 'once' | 'always' {
    return this.runInView === 'always' ? 'always' : 'once'; // Default to 'once' if undefined or 'never'
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
   console.log(`[MotionOne] 🚀 Initializing directive for element:`, this.elementId);
   console.log(`[MotionOne] 📋 Element details:`, {
     tag: this.el.nativeElement.tagName,
     text: this.el.nativeElement.textContent?.trim().substring(0, 30) + '...',
     runInView: this.runInView,
     isRunInViewEnabled: this.isRunInViewEnabled,
     runInViewRepeat: this.runInViewRepeat
   });

   this.applyInitialStyles(); // Ensure initial styles are applied

    // Only run animations in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Check if this is a child of another motionone directive
      let parent = this.el.nativeElement.parentElement;
      while (parent) {
        if (parent.hasAttribute('motionone')) {
          this.isChild = true;
          console.log(`[MotionOne] 👶 ${this.elementId} detected as child of another motionone element: ${parent.id}`);
          break;
        }
        parent = parent.parentElement;
      }

      console.log(`[MotionOne] 🎯 ${this.elementId} isChild=${this.isChild}, will ${!this.isChild ? 'auto-play' : 'wait for parent'}`);

      // Set up runInView logic based on parent-child relationship
      if (this.isRunInViewEnabled) {
        if (!this.isChild) {
          // Parent elements with runInView set up their own observer
          console.log('[MotionOne] 🔍 Setting up runInView for PARENT element:', this.elementId, 'repeat:', this.runInViewRepeat);
          this.setupInViewAnimation();
        } else {
          // Child elements with runInView only set up observer if parent doesn't have stagger
          // We'll check this later in ngAfterContentInit when we know about parent stagger settings
          console.log('[MotionOne] ⏸️ Child element with runInView - will check parent stagger later:', this.elementId);
        }
      } else if (!this.isChild && !this.isRunInViewEnabled) {
        // Only auto-play animation if not a child AND no runInView
        console.log('[MotionOne] ▶️ Running immediate animation for:', this.elementId);
        this.playAnimation(this.initial, this.animate);
      } else if (!this.isChild && this.isRunInViewEnabled) {
        // Parent with runInView - wait for intersection observer
        console.log('[MotionOne] ⏸️ Parent with runInView - waiting for viewport entry:', this.elementId);
      } else {
        console.log('[MotionOne] ⏸️ Child element waiting for parent:', this.elementId);
      }

      // Setup inView animation if inView or whileInView properties are set (but not if runInView is already handled)
      if (!this.isRunInViewEnabled &&
          ((this.inView && Object.keys(this.inView).length > 0) ||
           (this.whileInView && Object.keys(this.whileInView).length > 0))) {
        console.log('[MotionOne] 🎪 Setting up inView/whileInView animation for:', this.elementId);
        this.setupInViewAnimation();
      }
    }
  }

  ngAfterContentInit() {
    // Register child directives if we have staggerChildren
    if (this.childMotionDirectives && this.childMotionDirectives.length > 0) {
      console.log(`[MotionOne] 👨‍👩‍👧‍👦 ${this.elementId} Found ${this.childMotionDirectives.length} child directives`);

      // Set this directive as the parent for all children
      setTimeout(() => {
        // Filter out self from children
        const childDirectives = this.childMotionDirectives.filter(child => child !== this);
        this.childrenCount = childDirectives.length;

        console.log(`[MotionOne] 👨‍👩‍👧‍👦 ${this.elementId} After filtering self, found ${this.childrenCount} actual children`);

        // Set parent and index for each child
        childDirectives.forEach((child, index) => {
          console.log(`[MotionOne] 👶 ${this.elementId} Setting parent for child ${child.elementId} with index ${index}/${this.childrenCount}`);
          child.setParent(this, index, this.childrenCount);
        });

        // Check if we need to stagger children
        const staggerValue = this.getStaggerValue();
        console.log(`[MotionOne] 📊 ${this.elementId} Stagger value: ${staggerValue}, childrenCount: ${this.childrenCount}`);

        // Handle child runInView setup based on parent runInView and stagger
        if (this.runInView === 'always') {
          console.log(`[MotionOne] 🎯 ${this.elementId} Parent has runInView="always" - will manage ALL children`);

          // Mark ALL children as managed by parent (regardless of stagger)
          childDirectives.forEach(child => {
            if (child.isRunInViewEnabled) {
              console.log(`[MotionOne] 🏷️ Child ${child.elementId} managed by parent with runInView="always"`);
              child.isStaggeredChild = true; // Mark so child knows parent manages it
              // DO NOT set up intersection observer - parent handles everything
            }
          });

          // CRITICAL: Set up intersection observer for the parent
          console.log(`[MotionOne] 🔍 ${this.elementId} Setting up intersection observer for runInView="always"`);
          this.setupRunInViewObserver();

          // Check if we have stagger
          if (staggerValue > 0 && this.childrenCount > 0) {
            console.log(`[MotionOne] ⏸️ ${this.elementId} Skipping immediate stagger (runInView="always" - will wait for intersection observer)`);
          } else {
            console.log(`[MotionOne] ⏸️ ${this.elementId} No stagger, but parent has runInView="always" - will wait for intersection observer`);
          }
        } else if (staggerValue > 0 && this.childrenCount > 0) {
          console.log(`[MotionOne] 🎭 ${this.elementId} Will apply stagger to children`);

          // For staggered children, mark them as staggered but DON'T set up intersection observers
          childDirectives.forEach(child => {
            if (child.isRunInViewEnabled) {
              console.log(`[MotionOne] 🏷️ Marking staggered child ${child.elementId}`);
              child.isStaggeredChild = true;
            }
          });

          // Trigger staggered animations for children (only if parent not using runInView)
          if (!this.isRunInViewEnabled) {
            console.log(`[MotionOne] 🚀 ${this.elementId} Triggering immediate stagger (no runInView)`);
            this.applyStaggerToChildren();
          } else {
            console.log(`[MotionOne] ⏸️ ${this.elementId} Skipping immediate stagger (runInView enabled)`);
          }
        } else {
          console.log(`[MotionOne] 🔄 ${this.elementId} No stagger - children can have individual runInView observers`);

          // If no stagger and parent doesn't have runInView="always", children can set up their own observers
          childDirectives.forEach(child => {
            if (child.isRunInViewEnabled) {
              console.log(`[MotionOne] 🔍 Setting up individual runInView for child: ${child.elementId}`);
              child.setupInViewAnimation();
            }
          });
        }
      });
    } else {
      console.log(`[MotionOne] 👶 ${this.elementId} No child directives found`);
    }
  }

  setParent(parent: MotionOneDirective, index: number, totalChildren: number) {
    this.parentDirective = parent;
    this.isChild = true;
    this.childIndex = index;
    this.childrenCount = totalChildren;
  }

  // COMPLETE RESET METHOD: Reset parent and all children to initial state (like Framer Motion)
  public completeResetToInitial() {
    console.log(`[MotionOne] 🔥 COMPLETE RESET - ${this.elementId} resetting self and all children to initial`);

    // 1. Reset self to initial
    this.forceResetToInitial();

    // 2. Reset all children to their individual initial states
    if (this.childMotionDirectives && this.childMotionDirectives.length > 0) {
      const childDirectives = this.childMotionDirectives.filter(child => child !== this);
      console.log(`[MotionOne] 🔄 COMPLETE RESET - Found ${childDirectives.length} children to reset`);

      childDirectives.forEach((child, index) => {
        console.log(`[MotionOne] 🔄 COMPLETE RESET - Resetting child ${index + 1}: ${child.elementId}`);
        child.forceResetToInitial();
      });

      console.log(`[MotionOne] ✅ COMPLETE RESET - All children reset to initial state`);
    }
  }

  // FORCE RESET: Reset this element to its initial state immediately
  public forceResetToInitial() {
    console.log(`[MotionOne] 🔧 FORCE RESET - ${this.elementId} resetting to initial`);

    // Stop any current animation immediately
    if (this.controls) {
      this.controls.stop();
      this.controls = null;
      console.log(`[MotionOne] ⏹️ FORCE RESET - Stopped animation for ${this.elementId}`);
    }

    // Get this element's initial state
    const initialVariant = this.getVariant(this.initial);
    const initialStyles = this.extractStyleProperties(initialVariant);

    console.log(`[MotionOne] 🎯 FORCE RESET - ${this.elementId} applying initial:`, initialStyles);
    console.log(`[MotionOne] 🎯 FORCE RESET - ${this.elementId} raw initial:`, this.initial);

    // Apply initial styles immediately with no transition
    this.el.nativeElement.style.transition = 'none';

    // Clear any existing styles first
    this.el.nativeElement.style.opacity = '';
    this.el.nativeElement.style.transform = '';

    // Apply initial styles
    Object.assign(this.el.nativeElement.style, initialStyles);
    this.el.nativeElement.offsetHeight; // Force reflow
    this.el.nativeElement.style.transition = '';

    // Reset animation flags
    this.initialAnimationPlayed = false;

    console.log(`[MotionOne] ✅ FORCE RESET - ${this.elementId} reset complete`);
  }

  // Simple method to reset child to initial if parent has runInView
  public resetToInitialIfParentHasRunInView() {
    console.log(`[MotionOne] 🔄 Child ${this.elementId} resetting to initial (parent has runInView)`);
    this.forceResetToInitial();
  }

  // Method to call complete reset when parent exits viewport
  public parentExitViewportReset() {
    console.log(`[MotionOne] 🔥 PARENT EXIT VIEWPORT - ${this.elementId} triggering complete reset`);
    this.completeResetToInitial();
  }

  // Set up intersection observer for runInView functionality
  private setupRunInViewObserver() {
    console.log(`[MotionOne] 🔍 Setting up runInView intersection observer for: ${this.elementId}`);

    if (!isPlatformBrowser(this.platformId)) {
      console.log(`[MotionOne] ⚠️ Not in browser - skipping intersection observer setup`);
      return;
    }

    // Create intersection observer with proper threshold
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log(`[MotionOne] 👁️ Intersection callback for ${this.elementId}:`, {
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio
          });

          if (entry.isIntersecting) {
            console.log(`[MotionOne] ✅ ENTERING VIEWPORT: ${this.elementId}`);
            this.handleViewportEntry();
          } else {
            console.log(`[MotionOne] ❌ EXITING VIEWPORT: ${this.elementId}`);
            this.handleViewportExit();
          }
        });
      },
      {
        root: null, // Use viewport as root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of element is visible
      }
    );

    // Start observing the element
    this.observer.observe(this.el.nativeElement);
    console.log(`[MotionOne] 🎯 Started observing ${this.elementId} for viewport changes`);
  }

  // Handle when element enters viewport
  private handleViewportEntry() {
    console.log(`[MotionOne] 🚀 ${this.elementId} handling viewport entry`);

    // Check if we have stagger children
    const staggerValue = this.getStaggerValue();
    if (staggerValue > 0 && this.childMotionDirectives?.length > 0) {
      console.log(`[MotionOne] 🎭 ${this.elementId} triggering stagger animation`);
      this.applyStaggerToChildren();
    } else {
      console.log(`[MotionOne] ▶️ ${this.elementId} triggering normal animation`);
      this.playAnimation(this.initial, this.animate);
    }
  }

  // Handle when element exits viewport
  private handleViewportExit() {
    if (this.runInView === 'always') {
      console.log(`[MotionOne] EXIT ${this.elementId} - reset children to initial variant`);

      // Force children to their initial variant state
      if (this.childMotionDirectives && this.childMotionDirectives.length > 0) {
        const childDirectives = this.childMotionDirectives.filter(child => child !== this);
        childDirectives.forEach((child) => {
          console.log(`[MotionOne] EXIT RESET ${child.elementId} using initial variant:`, child.initial);

          // Stop any animation and immediately set to initial variant
          if (child.controls) {
            child.controls.stop();
            child.controls = null;
          }

          // Use playAnimation to go to initial variant (instant)
          child.playAnimation(child.animate, child.initial);
          child.initialAnimationPlayed = false;
        });
      }
    }
  }

  // Method to stagger children animations
  applyStaggerToChildren() {
    console.log('[MotionOne] 🎭 applyStaggerToChildren for:', this.elementId);

    // Get stagger configuration
    const staggerValue = this.getStaggerValue();
    const staggerDirection = this.getStaggerDirection();
    const delayChildren = this.delayChildren; // number
    const parentDelay = (((this.transition as TransitionOptions)?.delay) ?? 0) as number;

    console.log('[MotionOne] 📊 Stagger config:', {
      staggerValue,
      staggerDirection,
      delayChildren,
      parentDelay
    });

    // Get all child directives (excluding self)
    const childDirectives = this.childMotionDirectives.filter(child => child !== this);
    console.log('[MotionOne] 👶 Found', childDirectives.length, 'child directives');

    // Determine when to animate parent relative to children
    const when = this.getWhen();
    console.log('[MotionOne] ⏰ When property:', when);

    // Animate parent if needed
    if (when !== 'afterChildren') {
      console.log('[MotionOne] ▶️ Running parent self animation (before/together)');
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

      console.log(`[MotionOne] 👶 Child ${childDirective.elementId} index=${index}, staggerIndex=${staggerIndex}, totalDelay=${totalDelay}`);

      // Force override the child's delay
      childDirective.overrideDelay(totalDelay);

      // Trigger the child's animation directly with its own variants
      console.log(`[MotionOne] 🎬 Triggering animation for child ${childDirective.elementId}`);
      console.log(`[MotionOne] 🔍 Child ${childDirective.elementId} initial:`, childDirective.initial);
      console.log(`[MotionOne] 🔍 Child ${childDirective.elementId} animate:`, childDirective.animate);

      // CRITICAL: Use child's own variants directly (parent has no initial/animate)
      setTimeout(() => {
        console.log(`[MotionOne] VARIANT CHECK ${childDirective.elementId} FROM:`, childDirective.initial, 'TO:', childDirective.animate);
        childDirective.playAnimation(childDirective.initial, childDirective.animate);
      }, totalDelay * 1000);
    });

    // Animate parent after children if specified
    if (when === 'afterChildren') {
      const totalChildrenDuration = (parentDelay as number) + delayChildren + (this.childrenCount * staggerValue);
      console.log('[MotionOne] ⏰ Running parent animation after children, delay:', totalChildrenDuration);
      this.overrideDelay(totalChildrenDuration);
      this.runSelfAnimation();
    }

    console.log('[MotionOne] ✅ applyStaggerToChildren completed');
  }

  // Method to override the delay for this directive
  overrideDelay(delay: number) {
    console.log(`[MotionOne] ⏰ ${this.elementId} Delay overridden: ${this.staggerDelay} -> ${delay}`);
    this.staggerDelay = delay;
  }

  // Run animation only for this element (not children)
  runSelfAnimation() {
    // Get animation options
    const options = this.getAnimationOptions();

    console.log(`[MotionOne] 🎯 ${this.elementId} Running self animation with delay: ${options.delay}`);

    // Extract only style properties for animation
    const targetStyles = this.extractStyleProperties(this.getVariant(this.animate));
    const startStyles = this.extractStyleProperties(this.getVariant(this.initial));

    console.log('[MotionOne] 📊 SELF ANIMATION - Target styles:', targetStyles);
    console.log('[MotionOne] 📊 SELF ANIMATION - Start styles:', startStyles);

    // Add DOM style logging before applying start styles
    const beforeStartComputedStyles = window.getComputedStyle(this.el.nativeElement);
    console.log('[MotionOne] 📊 BEFORE START STYLES - Current computed styles:', {
      opacity: beforeStartComputedStyles.opacity,
      transform: beforeStartComputedStyles.transform,
      backgroundColor: beforeStartComputedStyles.backgroundColor
    });

    // Only apply start state immediately if not part of stagger coordination
    // For stagger children, the parent coordination handles initial state setup
    if (!this.isStaggeredChild) {
      console.log('[MotionOne] 🔧 Applying start styles (not staggered child)');
      Object.assign(this.el.nativeElement.style, startStyles);
    } else {
      console.log('[MotionOne] ⏸️ Skipping start styles application (staggered child - parent handles this)');
    }

    // Add logging after applying start styles
    const afterStartComputedStyles = window.getComputedStyle(this.el.nativeElement);
    console.log('[MotionOne] 📊 AFTER START STYLES - Current computed styles:', {
      opacity: afterStartComputedStyles.opacity,
      transform: afterStartComputedStyles.transform,
      backgroundColor: afterStartComputedStyles.backgroundColor
    });

    // Create animation
    console.log('[MotionOne] 🎬 Creating animation for element:', this.elementId);
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
  public extractStyleProperties(variant: VariantWithTransition): Record<string, any> {
    if (!variant) return {};
    
    const result: Record<string, any> = {};
    
    for (const key in variant) {
      // skip meta keys
      if (key === 'transition' || key === 'at') continue;
      // Allow raw transform strings or keyframe arrays to pass through untouched
      if (key === 'transform') {
        (result as any)['transform'] = (variant as any)[key];
        continue;
      }
      if (this.isTransformProperty(key)) {
        this.applyTransformProperty(result, key, variant[key]);
      } else {
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
    
    // Always prioritize stagger delay over any other delay settings (including 0)
    const delay = this.staggerDelay !== undefined && this.staggerDelay >= 0 ? this.staggerDelay : (transitionObj.delay ?? this.delay);

    console.log(`[MotionOne] ⏰ ${this.elementId} getAnimationOptions - staggerDelay: ${this.staggerDelay}, transitionDelay: ${transitionObj.delay}, globalDelay: ${this.delay}, finalDelay: ${delay}`);
    
    const easeInput = transitionObj.ease ?? this.easing;
    // Detect if target contains keyframe arrays (avoid native spring in that case)
    let targetHasKeyframeArrays = false;
    if (targetState) {
      for (const k of Object.keys(targetState)) {
        if (k === 'transition' || k === 'at') continue;
        const v: any = (targetState as any)[k];
        if (Array.isArray(v)) { targetHasKeyframeArrays = true; break; }
      }
    }
    // If spring config and no keyframe arrays, prefer native spring options (no fixed duration)
    if (easeInput && typeof easeInput === 'object' && 'type' in (easeInput as any) && (easeInput as any).type === 'spring' && !targetHasKeyframeArrays) {
      const springOptions: any = {
        type: 'spring',
        stiffness: (easeInput as any).stiffness ?? 100,
        damping: (easeInput as any).damping ?? 10,
        delay,
        repeat: this.getRepeatValue(transitionObj),
        repeatDelay: transitionObj.repeatDelay,
        onComplete: () => this.animationComplete.emit()
      };
      const direction = this.mapRepeatTypeToDirection(transitionObj.repeatType);
      if (direction) springOptions.direction = direction;
      if (transitionObj.repeatType) springOptions.repeatType = transitionObj.repeatType;
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

    console.log('[MotionOne] 🎬 Playing animation for:', this.elementId);
    console.log('[MotionOne] 📊 Start state:', resolvedStartState);
    console.log('[MotionOne] 🎯 Target state:', resolvedTargetState);
    console.log('[MotionOne] 🔧 isChild:', this.isChild, 'isRunInViewEnabled:', this.isRunInViewEnabled);

    // Check if target state has an 'at' property
    if (resolvedTargetState.at !== undefined) {
      console.log(`[MotionOne] ⏰ Scheduling animation to start in ${resolvedTargetState.at} seconds`);
      // Schedule the animation to start at the specified time
      setTimeout(() => {
        console.log('[MotionOne] ⏰ Executing delayed animation');
        this.continueAnimation(resolvedTargetState, false);
      }, resolvedTargetState.at * 1000); // Convert seconds to milliseconds
      return;
    }

    // Continue with normal animation if no 'at' property
    this.continueAnimation(resolvedTargetState, false);
  }

  private continueAnimation(resolvedTargetState: VariantWithTransition, isInitialAnimation: boolean) {
    console.log('[MotionOne] 🎬 continueAnimation for:', this.elementId, 'isInitialAnimation:', isInitialAnimation);
    console.log('[MotionOne] 📊 Target state:', resolvedTargetState);

    // Timeline takes precedence
    if (this.timeline && this.timeline.length > 0) {
      console.log('[MotionOne] 📋 Running timeline animation');
      this.runTimeline(resolvedTargetState);
      return;
    }

    // Detect per-property transition map on the state
    const t: any = resolvedTargetState.transition;
    const isPerPropMap = t && typeof t === 'object' && t.duration === undefined && t.delay === undefined && t.ease === undefined;
    if (isPerPropMap) {
      console.log('[MotionOne] 🔧 Running per-property animations');
      this.runPerPropertyAnimations(resolvedTargetState);
      return;
    }

    // Check if this is the initial animation to the animate state
    if (isInitialAnimation && !this.initialAnimationPlayed) {
      console.log('[MotionOne] 🎯 Processing initial animation');
      const staggerValue = this.getStaggerValue();
      console.log('[MotionOne] 📊 Stagger value:', staggerValue, 'children count:', this.childMotionDirectives?.length);

      if (staggerValue > 0 && this.childMotionDirectives && this.childMotionDirectives.length > 1) {
        console.log('[MotionOne] 👨‍👩‍👧‍👦 Stagger detected - running stagger logic');
        // Stagger will be handled by ngAfterContentInit
        // Just animate self according to 'when' property
        const when = this.getWhen();
        console.log('[MotionOne] ⏰ When property:', when);

        if (when !== 'afterChildren') {
          console.log('[MotionOne] ▶️ Running self animation (stagger context)');
          this.runSelfAnimation();
        }

        return;
      }
    }

    console.log('[MotionOne] 🎯 Running standard animation');

    // For non-staggered animations or non-initial animations
    // Get animation options with priority to target state's transition
    const options = this.getAnimationOptions(resolvedTargetState);
    console.log('[MotionOne] ⚙️ Animation options:', options);

    // Extract only style properties for animation (excluding transition)
    const targetStyles = this.extractStyleProperties(resolvedTargetState);
    console.log('[MotionOne] 🎨 Target styles:', targetStyles);

    // Create animation with Motion One for the element itself
    console.log('[MotionOne] 🚀 Creating animation with Motion One');
    this.controls = this.motionAnimation.animate(
      this.el.nativeElement as Target,
      targetStyles,
      options
    );
    console.log('[MotionOne] ✅ Animation created successfully');

    if (isInitialAnimation) {
      this.initialAnimationPlayed = true;
      console.log('[MotionOne] 🏷️ Marked initial animation as played');
    }

    // Handle regular DOM children (without motionone directives) for non-initial animations
    if (!isInitialAnimation && this.el.nativeElement.children.length > 0) {
      console.log('[MotionOne] 👶 Processing children elements');
      // Get children elements
      const children = Array.from(this.el.nativeElement.children) as HTMLElement[];
      console.log('[MotionOne] 👶 Found', children.length, 'children');

      // Animate each child with the same animation
      children.forEach((child, index) => {
        // Skip children that have their own motionone directive
        if (child.hasAttribute('motionone')) {
          console.log('[MotionOne] ⏭️ Skipping child', index, '(has motionone directive)');
          return;
        }

        console.log('[MotionOne] 🎬 Animating child', index);
        // Create child animation
        const childControl = this.motionAnimation.animate(
          child,
          targetStyles,
          options
        );

        // Store the control for cleanup
        this.childrenControls.push(childControl);
      });
    } else if (!isInitialAnimation) {
      console.log('[MotionOne] 👶 No children to process or is initial animation');
    }

    console.log('[MotionOne] ✅ continueAnimation completed for:', this.elementId);
  }

  private runPerPropertyAnimations(resolvedTargetState: VariantWithTransition) {
    const baseDelay = this.staggerDelay !== undefined && this.staggerDelay >= 0 ? this.staggerDelay : (((resolvedTargetState.transition as TransitionOptions)?.delay) ?? this.delay);
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
    const baseDelay = this.staggerDelay !== undefined && this.staggerDelay >= 0 ? this.staggerDelay : (((resolvedTargetState.transition as TransitionOptions)?.delay) ?? this.delay);
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
      const easeInput = step.ease ?? this.easing;

      // Build options with repeat and direction
      // Prefer function easing always in timeline to preserve keyframe interpolation
      const ease = this.getEasing(easeInput as any);
      const options: any = { duration, delay: start, easing: ease } as any;
      (options as any).ease = ease; // Back-compat

      // Apply repeat controls if provided
      if (step.repeat !== undefined) {
        options.repeat = step.repeat === true ? Infinity : step.repeat;
      }
      if (step.repeatDelay !== undefined) {
        options.repeatDelay = step.repeatDelay;
      }
      const dir = this.mapRepeatTypeToDirection(step.repeatType);
      if (dir) options.direction = dir;
      if (step.repeatType) options.repeatType = step.repeatType;
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

  private setupInViewAnimation() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('[MotionOne] 🚀🚀🚀 setupInViewAnimation called for:', this.elementId);
      console.log('[MotionOne] 📋 Config - runInViewEnabled:', this.isRunInViewEnabled, 'repeat:', this.runInViewRepeat);

      try {
        // Use Motion One's inView API - it handles state management automatically
        if (this.isRunInViewEnabled) {
          console.log('[MotionOne] 🎯 Using Motion One inView API for superior state management');

          // Set up Motion One's inView with automatic state management
          this.setupMotionOneInView();
        } else {
          // For non-runInView functionality, use Motion One's inView for backwards compatibility
          console.log('[MotionOne] 🎪 Using Motion One inView for whileInView/inView functionality');

          this.inViewInstance = inView(
            this.el.nativeElement,
            (info: any) => {
              console.log('\n[MotionOne] 👁️ Motion One inView callback for:', this.elementId);
              console.log('[MotionOne] ✅ ENTERING VIEWPORT (Motion One):', this.elementId);
              this.runInViewAnimation();
            },
            {
              margin: this.offset,
              amount: 'some'
            }
          );
          console.log('[MotionOne] ✅ Motion One inView created for:', this.elementId);
        }
      } catch (error) {
        console.error('[MotionOne] ❌ Error setting up inView observer:', error);
      }
    }
  }

  runInViewAnimation() {
    if (this.inView && Object.keys(this.inView).length > 0) {
      this.playAnimation(this.initial, this.inView);
    }
  }

  // New method using Motion One's inView API following Framer Motion pattern
  private setupMotionOneInView() {
    console.log('[MotionOne] 🔥🔥🔥 NEW MOTION ONE INVIEW IMPLEMENTATION 🔥🔥🔥 Setting up for:', this.elementId);
    console.log('[MotionOne] 🔥 runInViewEnabled:', this.isRunInViewEnabled);
    console.log('[MotionOne] 🔥 runInView value:', this.runInView);

    // Get margin from offset
    const margin = this.offset || '0px';

    // Determine if this is a parent with stagger children
    const hasStaggerChildren = this.getStaggerValue() > 0 && this.childMotionDirectives?.length > 1;

    if (hasStaggerChildren && !this.isChild) {
      // Parent with stagger children - handle stagger animation
      console.log('[MotionOne] 👨‍👩‍👧‍👦 Setting up stagger parent inView');
      this.setupStaggerParentInView(margin);
    } else if (!this.isStaggeredChild) {
      // Individual element or non-staggered child
      console.log('[MotionOne] 🎯 Setting up individual element inView');
      this.setupIndividualElementInView(margin);
    } else {
      console.log('[MotionOne] ⏸️ Staggered child - parent will handle animation');
    }
  }

  private setupStaggerParentInView(margin: string) {
    // For parent elements with stagger, use inView with enter/exit callbacks
    this.inViewInstance = inView(
      this.el.nativeElement,
      (info: { isIntersecting: boolean }) => {
        if (info.isIntersecting) {
          console.log('[MotionOne] ✅ STAGGER PARENT ENTERING VIEWPORT:', this.elementId);

          // Stop any existing animations
          if (this.controls) this.controls.stop();

          // Reset parent to initial
          const parentInitialStyles = this.extractStyleProperties(this.getVariant(this.initial));
          if (Object.keys(parentInitialStyles).length > 0) {
            this.el.nativeElement.style.transition = 'none';
            Object.assign(this.el.nativeElement.style, parentInitialStyles);
            this.el.nativeElement.offsetHeight;
            this.el.nativeElement.style.transition = '';
          }

          // Get all child elements
          const childDirectives = this.childMotionDirectives?.filter(child => child !== this) || [];

          if (childDirectives.length > 0) {
            console.log(`[MotionOne] 🎭 Animating ${childDirectives.length} children with stagger`);

            // Stop and reset all children to initial state first
            childDirectives.forEach(child => {
              if (child.controls) child.controls.stop();

              const childInitialStyles = child.extractStyleProperties(child.getVariant(child.initial));
              console.log(`[MotionOne] 🔄 Child ${child.elementId} reset to:`, childInitialStyles);

              child.el.nativeElement.style.transition = 'none';
              Object.assign(child.el.nativeElement.style, childInitialStyles);
              child.el.nativeElement.offsetHeight;
              child.el.nativeElement.style.transition = '';
            });

            // Small delay to ensure resets are applied
            setTimeout(() => {
              const staggerValue = this.getStaggerValue();

              // Animate children with stagger
              childDirectives.forEach((child, index) => {
                const childAnimateStyles = child.extractStyleProperties(child.getVariant(child.animate));
                const options = child.getAnimationOptions();

                // Override delay with stagger delay
                const staggerDelay = index * staggerValue;
                options.delay = staggerDelay;

                console.log(`[MotionOne] 🎬 Animating child ${child.elementId} from initial to animate with delay: ${staggerDelay}`);

                // Create animation for this child
                child.controls = animate(child.el.nativeElement, childAnimateStyles, options);
              });

              // Animate parent if it has its own animation
              const parentAnimateStyles = this.extractStyleProperties(this.getVariant(this.animate));
              if (Object.keys(parentAnimateStyles).length > 0) {
                const parentOptions = this.getAnimationOptions();
                this.controls = animate(this.el.nativeElement, parentAnimateStyles, parentOptions);
              }
            }, 50);
          }
        } else if (this.runInViewRepeat === 'always') {
          // Exit viewport - reset to initial for "always" behavior
          console.log('[MotionOne] ❌ STAGGER PARENT EXITING VIEWPORT:', this.elementId);

          // Stop all animations
          if (this.controls) this.controls.stop();

          // Reset parent to initial
          const parentInitialStyles = this.extractStyleProperties(this.getVariant(this.initial));
          if (Object.keys(parentInitialStyles).length > 0) {
            this.el.nativeElement.style.transition = 'none';
            Object.assign(this.el.nativeElement.style, parentInitialStyles);
            this.el.nativeElement.offsetHeight;
            this.el.nativeElement.style.transition = '';
          }

          // Reset all children to initial
          const childDirectives = this.childMotionDirectives?.filter(child => child !== this) || [];
          childDirectives.forEach(child => {
            if (child.controls) child.controls.stop();

            const childInitialStyles = child.extractStyleProperties(child.getVariant(child.initial));
            child.el.nativeElement.style.transition = 'none';
            Object.assign(child.el.nativeElement.style, childInitialStyles);
            child.el.nativeElement.offsetHeight;
            child.el.nativeElement.style.transition = '';
          });

          console.log('[MotionOne] ✅ All elements reset to initial on exit');
        }
      },
      {
        margin,
        amount: 0.1
      }
    );
  }

  private setupIndividualElementInView(margin: string) {
    // For individual elements, simple initial -> animate transition
    this.inViewInstance = inView(
      this.el.nativeElement,
      (info: { isIntersecting: boolean }) => {
        if (info.isIntersecting) {
          console.log('[MotionOne] ✅ INDIVIDUAL ENTERING VIEWPORT:', this.elementId);

          // Stop any existing animation
          if (this.controls) this.controls.stop();

          // Reset to initial state first
          const initialStyles = this.extractStyleProperties(this.getVariant(this.initial));
          this.el.nativeElement.style.transition = 'none';
          Object.assign(this.el.nativeElement.style, initialStyles);
          this.el.nativeElement.offsetHeight;
          this.el.nativeElement.style.transition = '';

          // Animate to target state
          const animateStyles = this.extractStyleProperties(this.getVariant(this.animate));
          const options = this.getAnimationOptions();

          console.log('[MotionOne] 🎬 Creating inView animation for:', this.elementId);
          this.controls = animate(this.el.nativeElement, animateStyles, options);
        } else if (this.runInViewRepeat === 'always') {
          // Exit viewport - reset to initial for "always" behavior
          console.log('[MotionOne] ❌ INDIVIDUAL EXITING VIEWPORT:', this.elementId);

          // Stop animation and reset to initial
          if (this.controls) this.controls.stop();

          const initialStyles = this.extractStyleProperties(this.getVariant(this.initial));
          this.el.nativeElement.style.transition = 'none';
          Object.assign(this.el.nativeElement.style, initialStyles);
          this.el.nativeElement.offsetHeight;
          this.el.nativeElement.style.transition = '';

          console.log('[MotionOne] ✅ Element reset to initial on exit');
        }
      },
      {
        margin,
        amount: 0.1
      }
    );
  }

  runInitAnimation() {
    if (!isPlatformBrowser(this.platformId) || !this.initial || !this.animate) return;

    console.log(`[MotionOne] 🎬 runInitAnimation for ${this.elementId} - isChild: ${this.isChild}, staggerDelay: ${this.staggerDelay ?? 'undefined'}`);
    console.log(`[MotionOne] 📋 Initial state:`, this.initial);
    console.log(`[MotionOne] 📋 Animate state:`, this.animate);

    // For child elements with stagger, make sure we use the stagger delay
    if (this.isChild && this.staggerDelay !== undefined && this.staggerDelay >= 0) {
      console.log(`[MotionOne] 🎭 ${this.elementId} Running staggered init animation with delay: ${this.staggerDelay}`);

      // Apply start state immediately (unless we're in a reset stagger flow)
      if (!this._skipStartStylesApplication) {
        const startStyles = this.extractStyleProperties(this.getVariant(this.initial));
        console.log(`[MotionOne] 🔄 ${this.elementId} Applying start styles:`, startStyles);

        // Force reset without transition
        const element = this.el.nativeElement;
        element.style.transition = 'none';
        Object.assign(element.style, startStyles);
      } else {
        console.log(`[MotionOne] ⏸️ ${this.elementId} SKIPPING start styles application (already reset by parent)`);
        // Clear the flag after use
        this._skipStartStylesApplication = false;
      }
      this.el.nativeElement.offsetHeight; // Force reflow

      // Get animation options with stagger delay
      const options = this.getAnimationOptions();
      console.log(`[MotionOne] ⚙️ ${this.elementId} Animation options:`, options);

      // VARIANT CONTROL: Use variants to ensure correct animation direction
      console.log(`[MotionOne] 🔍 ${this.elementId} VARIANT CONTROL - Raw animate property:`, this.animate);

      // Force use the child's specific animate variant (not parent's)
      const childAnimateVariant = this.getVariant(this.animate || {});
      console.log(`[MotionOne] 🔍 ${this.elementId} VARIANT CONTROL - Child animate variant:`, childAnimateVariant);

      // Ensure we're animating from initial → animate (not the reverse)
      const targetStyles = this.extractStyleProperties(childAnimateVariant);
      console.log(`[MotionOne] 🎯 ${this.elementId} VARIANT CONTROL - Target styles (should be animate state):`, targetStyles);

      // Double-check: log what the current element state is
      const currentStyles = window.getComputedStyle(this.el.nativeElement);
      console.log(`[MotionOne] 📊 ${this.elementId} VARIANT CONTROL - Current DOM state:`, {
        opacity: currentStyles.opacity,
        transform: currentStyles.transform
      });

      // Use playAnimation to ensure proper initial→animate direction
      setTimeout(() => {
        this.el.nativeElement.style.transition = '';
        console.log(`[MotionOne] 🚀 ${this.elementId} Using playAnimation for stagger (initial→animate)`);

        // CRITICAL: Use playAnimation with variants to force correct direction
        this.playAnimation(this.initial, this.animate);
        console.log(`[MotionOne] ✅ ${this.elementId} Staggered playAnimation completed`);
      }, 5);

      this.initialAnimationPlayed = true;
    } else {
      // Normal animation without stagger
      console.log(`[MotionOne] 🎬 ${this.elementId} Running normal init animation, isChild=${this.isChild}, staggerDelay=${this.staggerDelay ?? 'undefined'}, routeDelay=${this.routeDelay}`);
      this.playAnimation(this.initial, this.animate);
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
    const hasValuesAboveOne = times.some(t => t > 1);
    if (!hasValuesAboveOne) return times;
    const maxT = Math.max(...times);
    const safeDuration = Math.max(duration, 0.000001);
    const divisor = maxT > safeDuration * 1.001 ? maxT : safeDuration;
    return times.map(t => {
      const v = t / divisor;
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

  public getVariant(variant: VariantWithTransition | string): VariantWithTransition {
    if (typeof variant === 'string') {
      return this.variants[variant] || {};
    } else if (typeof variant === 'object') {
      return variant;
    } else {
      throw new Error('Invalid variant format');
    }
  }
}
