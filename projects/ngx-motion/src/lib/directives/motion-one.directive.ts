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
import { MotionAnimationOptionsService } from '../services/motion-animation-options.service';
import { MotionStaggerService } from '../services/motion-stagger.service';
import { MotionInViewService } from '../services/motion-inview.service';
import { MotionTimelineService } from '../services/motion-timeline.service';
import type { AnimationOptions, Target } from 'motion';
import { animate, inView } from '../services/motion-browser-safe';
import { VariantWithTransition, TransitionOptions, TimelineStep } from '../types/motion-animation.types';
import { MOTION_DEFAULTS } from '../constants/motion-defaults.constants';
import { extractStyleProperties } from '../utils/style-extraction.utils';
import { resolveVariant } from '../utils/variant.utils';

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
  @Input() duration: number = MOTION_DEFAULTS.DURATION;
  @Input() delay: number = MOTION_DEFAULTS.DELAY;
  @Input() delayChildren: number = MOTION_DEFAULTS.DELAY_CHILDREN;
  @Input() repeat: boolean = MOTION_DEFAULTS.REPEAT;
  @Input() exitDelay: number = MOTION_DEFAULTS.EXIT_DELAY;
  @Input() easing: string | number[] | { type: 'spring'; stiffness?: number; damping?: number } = MOTION_DEFAULTS.EASING;
  @Input() offset: string = MOTION_DEFAULTS.OFFSET;
  @Input() whileHover: VariantWithTransition = {};
  @Input() staggerChildren: number = MOTION_DEFAULTS.STAGGER_CHILDREN;
  @Input() staggerDirection: number = MOTION_DEFAULTS.STAGGER_DIRECTION;
  @Input() whileTap: VariantWithTransition = {};
  @Input() whileFocus: VariantWithTransition = {};
  @Input() whileInView: VariantWithTransition = {};
  @Input() runInView?: 'never' | 'once' | 'always';
  @Input() variants: { [key: string]: VariantWithTransition } = {};
  @Input() transition: TransitionOptions | Record<string, TransitionOptions> = {};
  @Input() timeline: TimelineStep[] | undefined;
  @Output() animationComplete = new EventEmitter<void>();

  // Public method to restart animations
  public restartAnimation() {
    if (this.controls) {
      this.controls.stop();
    }

    const initialVariant = this.getVariant(this.initial);
    const initialStyles = extractStyleProperties(initialVariant);

    const element = this.el.nativeElement;
    element.style.transition = 'none';
    Object.assign(element.style, initialStyles);
    element.offsetHeight;

    setTimeout(() => {
      element.style.transition = '';
      if (this.isRunInViewEnabled) {
        // For runInView elements, let inView handle the animation
      } else {
        this.playAnimation(this.initial, this.animate);
      }
    }, MOTION_DEFAULTS.RESET_TIMEOUT);
  }

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
  private isStaggeredChild = false;

  get scrollProgress() {
    return this.motionService.scrollYProgress();
  }

  private get isRunInViewEnabled(): boolean {
    return this.runInView === 'once' || this.runInView === 'always';
  }

  private get runInViewRepeat(): 'once' | 'always' {
    return this.runInView === 'always' ? 'always' : 'once';
  }

  constructor(
    public el: ElementRef,
    private motionService: MotionOneService,
    private motionAnimation: MotionAnimationService,
    private animationOptions: MotionAnimationOptionsService,
    private staggerService: MotionStaggerService,
    private inViewService: MotionInViewService,
    private timelineService: MotionTimelineService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.elementId = `motion-${uniqueIdCounter++}`;

    if (isPlatformBrowser(this.platformId)) {
      this.el.nativeElement.setAttribute('id', this.elementId);
      (this.el.nativeElement as any)._motionDirective = this;
      this.motionService.registerMotionElement(this);
      this.applyInitialStyles();
      this.routeDelay = this.motionService.getLongestExitDurationForRoute(this.router.url);
    }
  }

  ngOnInit() {
    this.applyInitialStyles();

    if (isPlatformBrowser(this.platformId)) {
      // Check if this is a child of another motionone directive
      let parent = this.el.nativeElement.parentElement;
      while (parent) {
        if (parent.hasAttribute('motionone')) {
          this.isChild = true;
          break;
        }
        parent = parent.parentElement;
      }

      // Set up runInView logic
      if (this.isRunInViewEnabled) {
        if (!this.isChild) {
          this.setupInViewAnimation();
        }
      } else if (!this.isChild) {
        this.playAnimation(this.initial, this.animate);
      }

      // Setup inView/whileInView animations
      if (!this.isStaggeredChild &&
          ((this.inView && Object.keys(this.inView).length > 0) ||
           (this.whileInView && Object.keys(this.whileInView).length > 0))) {
        this.setupInViewAnimation();
      }
    }
  }

  ngAfterContentInit() {
    if (this.childMotionDirectives && this.childMotionDirectives.length > 0) {
      setTimeout(() => {
        const childDirectives = this.childMotionDirectives.filter(child => child !== this);
        this.childrenCount = childDirectives.length;

        childDirectives.forEach((child, index) => {
          child.setParent(this, index, this.childrenCount);
        });

        const staggerValue = this.getStaggerValue();

        if (this.runInView === 'always') {
          childDirectives.forEach(child => {
            if (child.isRunInViewEnabled) {
              child.isStaggeredChild = true;
            }
          });
          this.setupRunInViewObserver();
        } else if (staggerValue > 0 && this.childrenCount > 0) {
          childDirectives.forEach(child => {
            if (child.isRunInViewEnabled) {
              child.isStaggeredChild = true;
            }
          });

          if (!this.isRunInViewEnabled) {
            this.applyStaggerToChildren();
          }
        } else {
          childDirectives.forEach(child => {
            if (child.isRunInViewEnabled) {
              child.setupInViewAnimation();
            }
          });
        }
      });
    }
  }

  setParent(parent: MotionOneDirective, index: number, totalChildren: number) {
    this.parentDirective = parent;
    this.isChild = true;
    this.childIndex = index;
    this.childrenCount = totalChildren;
  }

  public completeResetToInitial() {
    this.forceResetToInitial();

    if (this.childMotionDirectives && this.childMotionDirectives.length > 0) {
      const childDirectives = this.childMotionDirectives.filter(child => child !== this);
      childDirectives.forEach((child) => {
        child.forceResetToInitial();
      });
    }
  }

  public forceResetToInitial() {
    if (this.controls) {
      this.controls.stop();
      this.controls = null;
    }

    const initialVariant = this.getVariant(this.initial);
    const initialStyles = extractStyleProperties(initialVariant);

    this.el.nativeElement.style.transition = 'none';
    this.el.nativeElement.style.opacity = '';
    this.el.nativeElement.style.transform = '';
    Object.assign(this.el.nativeElement.style, initialStyles);
    this.el.nativeElement.offsetHeight;
    this.el.nativeElement.style.transition = '';

    this.initialAnimationPlayed = false;
  }

  public resetToInitialIfParentHasRunInView() {
    this.forceResetToInitial();
  }

  public parentExitViewportReset() {
    this.completeResetToInitial();
  }

  private setupRunInViewObserver() {
    if (!isPlatformBrowser(this.platformId)) return;

    const observer = this.inViewService.createRunInViewObserver(
      this.el.nativeElement,
      () => this.handleViewportEntry(),
      () => this.handleViewportExit()
    );

    if (observer) {
      this.observer = observer;
      this.observer.observe(this.el.nativeElement);
    }
  }

  private handleViewportEntry() {
    const staggerValue = this.getStaggerValue();
    if (staggerValue > 0 && this.childMotionDirectives?.length > 0) {
      this.applyStaggerToChildren();
    } else {
      this.playAnimation(this.initial, this.animate);
    }
  }

  private handleViewportExit() {
    if (this.runInView === 'always') {
      if (this.childMotionDirectives && this.childMotionDirectives.length > 0) {
        const childDirectives = this.childMotionDirectives.filter(child => child !== this);
        childDirectives.forEach((child) => {
          if (child.controls) {
            child.controls.stop();
            child.controls = null;
          }
          child.playAnimation(child.animate, child.initial);
          child.initialAnimationPlayed = false;
        });
      }
    }
  }

  applyStaggerToChildren() {
    const staggerValue = this.getStaggerValue();
    const staggerDirection = this.getStaggerDirection();
    const delayChildren = this.delayChildren;
    const parentDelay = (((this.transition as TransitionOptions)?.delay) ?? 0) as number;

    const childDirectives = this.childMotionDirectives.filter(child => child !== this);
    const when = this.getWhen();

    if (when !== 'afterChildren') {
      this.runSelfAnimation();
    }

    childDirectives.forEach((childDirective, index) => {
      const totalDelay = this.staggerService.calculateChildDelay(index, {
        childCount: this.childrenCount,
        staggerValue,
        staggerDirection,
        delayChildren,
        parentDelay
      });

      // Clear child's delay to prevent conflicts
      if (childDirective.transition && typeof childDirective.transition === 'object') {
        const childTransition = childDirective.transition as any;
        if (childTransition.delay !== undefined) {
          childTransition.delay = undefined;
        }
      }

      childDirective.overrideDelay(totalDelay);

      setTimeout(() => {
        childDirective.playAnimation(childDirective.initial, childDirective.animate);
      }, totalDelay * 1000);
    });

    if (when === 'afterChildren') {
      const totalChildrenDuration = this.staggerService.calculateTotalDuration({
        childCount: this.childrenCount,
        staggerValue,
        staggerDirection,
        delayChildren,
        parentDelay
      });
      this.overrideDelay(totalChildrenDuration);
      this.runSelfAnimation();
    }
  }

  overrideDelay(delay: number) {
    this.staggerDelay = delay;
  }

  runSelfAnimation() {
    const options = this.getAnimationOptions();
    const targetStyles = extractStyleProperties(this.getVariant(this.animate));
    const startStyles = extractStyleProperties(this.getVariant(this.initial));

    if (!this.isStaggeredChild) {
      Object.assign(this.el.nativeElement.style, startStyles);
    }

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

    this.inViewService.disconnect(this.observer);

    if (this.controls) {
      this.controls.stop();
    }

    this.childrenControls.forEach(control => {
      if (control) control.stop();
    });
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

    if (changes['transition'] && !changes['transition'].firstChange) {
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
    const styles = extractStyleProperties(this.getVariant(this.initial));
    Object.assign(this.el.nativeElement.style, styles);
  }

  private applyInitialStyles() {
    const styles = extractStyleProperties(this.getVariant(this.initial));

    if (styles && Object.keys(styles).length > 0) {
      if (this.isRunInViewEnabled) {
        this.el.nativeElement.style.transition = 'none';
        Object.assign(this.el.nativeElement.style, styles);
        this.el.nativeElement.offsetHeight;
        this.el.nativeElement.style.transition = '';
      } else {
        Object.assign(this.el.nativeElement.style, styles);
      }
    }
  }

  private applyAnimateStyles() {
    const styles = extractStyleProperties(this.getVariant(this.animate));
    Object.assign(this.el.nativeElement.style, styles);
  }

  public extractStyleProperties(variant: VariantWithTransition): Record<string, any> {
    return extractStyleProperties(variant);
  }

  private getAnimationOptions(targetState?: VariantWithTransition): AnimationOptions {
    return this.animationOptions.getAnimationOptions({
      targetState,
      animateState: this.getVariant(this.animate),
      staggerDelay: this.staggerDelay,
      transition: this.transition,
      delay: this.delay,
      easing: this.easing,
      duration: this.duration,
      repeat: this.repeat,
      onComplete: () => this.animationComplete.emit()
    });
  }

  private getStaggerValue(): number {
    return this.animationOptions.getStaggerValue(
      this.getVariant(this.animate),
      this.transition,
      this.staggerChildren
    );
  }

  private getStaggerDirection(): number {
    return this.animationOptions.getStaggerDirection(
      this.getVariant(this.animate),
      this.transition,
      this.staggerDirection
    );
  }

  private getWhen(): 'beforeChildren' | 'afterChildren' | 'together' {
    return this.animationOptions.getWhen(
      this.getVariant(this.animate),
      this.transition
    );
  }

  private playAnimation(startState: VariantWithTransition | string, targetState: VariantWithTransition | string) {
    if (!targetState || !isPlatformBrowser(this.platformId)) return;

    const resolvedStartState = resolveVariant(startState || this.initial, this.variants);
    const resolvedTargetState = resolveVariant(targetState || this.animate, this.variants);

    if (resolvedTargetState.at !== undefined) {
      setTimeout(() => {
        this.continueAnimation(resolvedTargetState, false);
      }, resolvedTargetState.at * 1000);
      return;
    }

    this.continueAnimation(resolvedTargetState, false);
  }

  private continueAnimation(resolvedTargetState: VariantWithTransition, isInitialAnimation: boolean) {
    // Timeline takes precedence
    if (this.timeline && this.timeline.length > 0) {
      this.runTimeline(resolvedTargetState);
      return;
    }

    // Per-property transition map
    const t: any = resolvedTargetState.transition;
    if (this.timelineService.isPerPropertyTransition(t)) {
      this.runPerPropertyAnimations(resolvedTargetState);
      return;
    }

    // Check for stagger on initial animation
    if (isInitialAnimation && !this.initialAnimationPlayed) {
      const staggerValue = this.getStaggerValue();
      if (staggerValue > 0 && this.childMotionDirectives && this.childMotionDirectives.length > 1) {
        const when = this.getWhen();
        if (when !== 'afterChildren') {
          this.runSelfAnimation();
        }
        return;
      }
    }

    // Normal animation
    const options = this.getAnimationOptions(resolvedTargetState);
    const targetStyles = extractStyleProperties(resolvedTargetState);

    this.controls = this.motionAnimation.animate(
      this.el.nativeElement as Target,
      targetStyles,
      options
    );

    if (isInitialAnimation) {
      this.initialAnimationPlayed = true;
    }

    // Handle regular DOM children (without motionone directives)
    if (!isInitialAnimation && this.el.nativeElement.children.length > 0) {
      const children = Array.from(this.el.nativeElement.children) as HTMLElement[];
      children.forEach((child) => {
        if (child.hasAttribute('motionone')) return;
        const childControl = this.motionAnimation.animate(child, targetStyles, options);
        this.childrenControls.push(childControl);
      });
    }
  }

  private runPerPropertyAnimations(resolvedTargetState: VariantWithTransition) {
    const baseDelay = this.staggerDelay !== undefined && this.staggerDelay >= 0
      ? this.staggerDelay
      : (((resolvedTargetState.transition as TransitionOptions)?.delay) ?? this.delay);

    const result = this.timelineService.runPerPropertyAnimations(
      this.el.nativeElement,
      resolvedTargetState,
      baseDelay,
      this.duration,
      this.easing,
      this.repeat,
      () => this.animationComplete.emit()
    );

    this.childrenControls = result.controls;
  }

  private runTimeline(resolvedTargetState: VariantWithTransition) {
    const baseDelay = this.staggerDelay !== undefined && this.staggerDelay >= 0
      ? this.staggerDelay
      : (((resolvedTargetState.transition as TransitionOptions)?.delay) ?? this.delay);

    const result = this.timelineService.runTimeline(
      this.el.nativeElement,
      this.timeline!,
      resolvedTargetState,
      baseDelay,
      this.duration,
      this.easing,
      this.repeat,
      () => this.animationComplete.emit()
    );

    this.childrenControls = result.controls;
  }

  private setupInViewAnimation() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        if (this.isRunInViewEnabled) {
          this.setupMotionOneInView();
        } else {
          const hasWhileInView = this.whileInView && Object.keys(this.whileInView).length > 0;
          const hasInView = this.inView && Object.keys(this.inView).length > 0;

          if (hasWhileInView) {
            this.setupWhileInViewAnimation();
          } else if (hasInView) {
            this.inViewInstance = inView(
              this.el.nativeElement,
              (info: any) => {
                this.runInViewAnimation();
              },
              {
                margin: this.offset,
                amount: 'some'
              }
            );
          }
        }
      } catch (error) {
        console.error('[MotionOne] ❌ Error setting up inView observer:', error);
      }
    }
  }

  runInViewAnimation() {
    if (this.inView && Object.keys(this.inView).length > 0) {
      this.playAnimation(this.initial, this.inView);
    } else if (this.whileInView && Object.keys(this.whileInView).length > 0) {
      this.playAnimation(this.initial, this.whileInView);
    }
  }

  private setupWhileInViewAnimation() {
    this.inViewInstance = inView(
      this.el.nativeElement,
      (info: any) => {
        this.playAnimation(this.initial, this.whileInView);
      },
      {
        margin: this.offset,
        amount: 'some'
      }
    );
  }

  private setupMotionOneInView() {
    const margin = this.offset || MOTION_DEFAULTS.INVIEW_MARGIN;
    const hasStaggerChildren = this.getStaggerValue() > 0 && this.childMotionDirectives?.length > 1;

    if (hasStaggerChildren && !this.isChild) {
      this.setupStaggerParentInView(margin);
    } else if (!this.isStaggeredChild) {
      this.setupIndividualElementInView(margin);
    }
  }

  private setupStaggerParentInView(margin: string) {
    this.inViewInstance = inView(
      this.el.nativeElement,
      (info: { isIntersecting: boolean }) => {
        if (info.isIntersecting) {
          if (this.controls) this.controls.stop();

          const parentInitialStyles = extractStyleProperties(this.getVariant(this.initial));
          if (Object.keys(parentInitialStyles).length > 0) {
            this.el.nativeElement.style.transition = 'none';
            Object.assign(this.el.nativeElement.style, parentInitialStyles);
            this.el.nativeElement.offsetHeight;
            this.el.nativeElement.style.transition = '';
          }

          const childDirectives = this.childMotionDirectives?.filter(child => child !== this) || [];

          if (childDirectives.length > 0) {
            childDirectives.forEach(child => {
              if (child.controls) child.controls.stop();
              const childInitialStyles = child.extractStyleProperties(child.getVariant(child.initial));
              child.el.nativeElement.style.transition = 'none';
              Object.assign(child.el.nativeElement.style, childInitialStyles);
              child.el.nativeElement.offsetHeight;
              child.el.nativeElement.style.transition = '';
            });

            setTimeout(() => {
              const staggerValue = this.getStaggerValue();
              childDirectives.forEach((child, index) => {
                const childAnimateStyles = child.extractStyleProperties(child.getVariant(child.animate));
                const options = child.getAnimationOptions();
                const staggerDelay = index * staggerValue;
                options.delay = staggerDelay;
                child.controls = animate(child.el.nativeElement, childAnimateStyles, options);
              });

              const parentAnimateStyles = extractStyleProperties(this.getVariant(this.animate));
              if (Object.keys(parentAnimateStyles).length > 0) {
                const parentOptions = this.getAnimationOptions();
                this.controls = animate(this.el.nativeElement, parentAnimateStyles, parentOptions);
              }
            }, MOTION_DEFAULTS.STAGGER_TIMEOUT);
          }
        } else if (this.runInViewRepeat === 'always') {
          if (this.controls) this.controls.stop();

          const parentInitialStyles = extractStyleProperties(this.getVariant(this.initial));
          if (Object.keys(parentInitialStyles).length > 0) {
            this.el.nativeElement.style.transition = 'none';
            Object.assign(this.el.nativeElement.style, parentInitialStyles);
            this.el.nativeElement.offsetHeight;
            this.el.nativeElement.style.transition = '';
          }

          const childDirectives = this.childMotionDirectives?.filter(child => child !== this) || [];
          childDirectives.forEach(child => {
            if (child.controls) child.controls.stop();
            const childInitialStyles = child.extractStyleProperties(child.getVariant(child.initial));
            child.el.nativeElement.style.transition = 'none';
            Object.assign(child.el.nativeElement.style, childInitialStyles);
            child.el.nativeElement.offsetHeight;
            child.el.nativeElement.style.transition = '';
          });
        }
      },
      {
        margin,
        amount: 0.1
      }
    );
  }

  private setupIndividualElementInView(margin: string) {
    this.inViewInstance = inView(
      this.el.nativeElement,
      (info: { isIntersecting: boolean }) => {
        if (info.isIntersecting) {
          if (this.controls) this.controls.stop();

          const initialStyles = extractStyleProperties(this.getVariant(this.initial));
          this.el.nativeElement.style.transition = 'none';
          Object.assign(this.el.nativeElement.style, initialStyles);
          this.el.nativeElement.offsetHeight;
          this.el.nativeElement.style.transition = '';

          setTimeout(() => {
            this.playAnimation(this.initial, this.animate);
          }, MOTION_DEFAULTS.STAGGER_TIMEOUT);
        } else if (this.runInViewRepeat === 'always') {
          if (this.controls) this.controls.stop();

          const initialStyles = extractStyleProperties(this.getVariant(this.initial));
          this.el.nativeElement.style.transition = 'none';
          Object.assign(this.el.nativeElement.style, initialStyles);
          this.el.nativeElement.offsetHeight;
          this.el.nativeElement.style.transition = '';
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

    if (this.isChild && this.staggerDelay !== undefined && this.staggerDelay >= 0) {
      if (!this._skipStartStylesApplication) {
        const startStyles = extractStyleProperties(this.getVariant(this.initial));
        const element = this.el.nativeElement;
        element.style.transition = 'none';
        Object.assign(element.style, startStyles);
      } else {
        this._skipStartStylesApplication = false;
      }
      this.el.nativeElement.offsetHeight;

      setTimeout(() => {
        this.el.nativeElement.style.transition = '';
        this.playAnimation(this.initial, this.animate);
      }, 5);

      this.initialAnimationPlayed = true;
    } else {
      this.playAnimation(this.initial, this.animate);
    }
  }

  runExitAnimation(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }

    if (!this.exit || Object.keys(this.exit).length === 0) {
      return Promise.resolve();
    }

    const exitTransition = (this.getVariant(this.exit).transition as TransitionOptions) ||
                          (this.transition as TransitionOptions) ||
                          {} as TransitionOptions;

    return new Promise<void>((resolve) => {
      const exitOptions: any = {
        duration: (exitTransition.duration ?? this.duration) as number,
        delay: (exitTransition.delay ?? this.exitDelay) as number,
        onComplete: () => {
          this.animationComplete.emit();
          resolve();
        }
      };

      const options: any = this.animationOptions.getAnimationOptions({
        targetState: this.getVariant(this.exit),
        transition: this.transition,
        delay: this.delay,
        easing: this.easing,
        duration: this.duration,
        repeat: this.repeat
      });

      exitOptions.easing = options.easing || options.ease;
      exitOptions.ease = options.ease || options.easing;

      if (this.controls) {
        this.controls.stop();
      }

      this.childrenControls.forEach(control => {
        if (control) control.stop();
      });

      const exitStyles = extractStyleProperties(this.getVariant(this.exit));

      this.controls = this.motionAnimation.animate(
        this.el.nativeElement as Target,
        exitStyles,
        exitOptions
      );

      if (!exitOptions.duration) {
        resolve();
      }
    });
  }

  cancel() {
    if (this.controls) {
      this.controls.stop();
    }

    this.childrenControls.forEach(control => {
      if (control) control.stop();
    });

    this.applyAnimateStyles();
  }

  getDuration(): number {
    if (!isPlatformBrowser(this.platformId)) return 0;

    try {
      const animateTransition = (this.getVariant(this.exit)?.transition as TransitionOptions) ||
                               (this.transition as TransitionOptions) ||
                               {} as TransitionOptions;
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

  public triggerExitAnimation(): Promise<void> {
    return this.runExitAnimation();
  }

  @HostListener('motionExit')
  onMotionExit() {
    this.runExitAnimation();
  }

  public getVariant(variant: VariantWithTransition | string): VariantWithTransition {
    return resolveVariant(variant, this.variants);
  }
}
