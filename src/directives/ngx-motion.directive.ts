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
} from '@angular/core';
import {
  AnimationBuilder,
  style,
  animate,
  AnimationPlayer,
  AnimationMetadata,
} from '@angular/animations';
import { MotionService } from '../app/services/motion.service';

let uniqueIdCounter = 0; // Static counter for unique IDs

@Directive({
  selector: '[motion]',
  standalone: true,
})

export class MotionDirective implements OnDestroy, OnChanges {
  @Input() initial: any = {};
  @Input() animate: any = {};
  @Input() exit: any = {};
  @Input() inView: any = {};
  @Input() duration = '0.3s';
  @Input() delay = '0s';
  @Input() repeat = false;
  @Input() exitDelay = '0s';
  @Input() easing = 'ease';
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
  private observer?: IntersectionObserver;
  private routeDelay: number = 0;

  get scrollProgress() {
    return this.motionService.scrollYProgress();
  }

  constructor(
    private builder: AnimationBuilder,
    private el: ElementRef,
    private motionService: MotionService,

  ) {

    this.elementId = `motion-${uniqueIdCounter++}`;
    this.el.nativeElement.setAttribute('id', this.elementId);

    this.motionService.registerMotionElement(this);
    this.applyInitialStyles();
    this.routeDelay = this.motionService.getLongestExitDuration();
  }


  ngOnInit() {
    if (Object.keys(this.inView).length > 0) {
      this.runInitAnimationsWhenInViewport(this, this.offset, this.repeat);
    }
    setTimeout(() => {
      this.playAnimation(this.initial, this.animate);
    }, this.routeDelay);
  }

  ngOnDestroy() {
    if (this.exit && Object.keys(this.exit).length > 0) {
       this.runExitAnimation();
    }

    //TODO: Add options to select reset behaviour , e.g either reset tto inintial or allow anim to run
    // this.resetPlayer(); // Ensure the animation is properly cleaned up
    // this.reset();

    if (this.observer) {
      this.observer.disconnect();
    }
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

  @HostListener('focus')
  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onPress(event: Event) {
    if (Object.keys(this.whileTap).length > 0) {
      if (Object.keys(this.animate).length > 0) {
        this.playAnimation(this.animate, this.whileTap);
      } else {
        this.playAnimation(this.initial, this.whileTap);
      }
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
    Object.assign(this.el.nativeElement.style, this.initial);
  }

  private resetPlayer() {
    if (this.player) {
      this.player.finish();
      this.player.destroy();
    }
  }

  private reset() {
    this.resetPlayer();
    this.el.nativeElement.removeAttribute('style');
  }

  private applyInitialStyles() {
    Object.assign(this.el.nativeElement.style, this.initial);
  }

  private applyAnimateStyles() {
    Object.assign(this.el.nativeElement.style, this.animate);
  }

  private playAnimation(startState: any, targetState: any) {
    if (!targetState) return;

    if (startState === undefined) {
      startState = this.initial;
    }

    if (targetState === undefined) {
      targetState = this.animate;
    }

    const delay = this.delay || '0ms';
    const duration = this.duration || '1s';
    const easing = this.easing || 'ease';

    if (typeof targetState === 'string') {
      targetState = this.variants[targetState];
    }

    if (typeof startState === 'string') {
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
      this.playAnimation(this.initial, this.inView);
      //this.animationComplete.emit();
    }
  }

  runInitAnimation() {
    if (this.initial && this.animate) {
      this.playAnimation(this.initial, this.animate);
      //this.animationComplete.emit();
    }
  }

  runExitAnimation() {
    if (this.exit) {
      this.playAnimation(this.animate, this.exit);
      //this.animationComplete.emit();
    }
  }

  cancel() {
    this.applyAnimateStyles();
  }

  getDuration(): number {
    const durationSeconds = parseFloat(this.duration);
    const delaySeconds = parseFloat(this.delay);
    return (durationSeconds + delaySeconds) * 1000;
  }

  getKeyByValue(object: any, key: any) {
    return Object.keys(object).find((key) => object[key] === key);
  }

  //TODO:Add logic for exiting elements
  runInitAnimationsWhenInViewport(
    element: MotionDirective,
    offset: string = '0px',
    repeat: boolean,
  ) {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
          //  console.log('In view');
            element.runInViewAnimation();

            if (!repeat) {
              this.observer?.unobserve(entry.target);
            }
          } else if (!entry.isIntersecting && repeat) {
            //console.log('Leaving view');
          }
        });
      },
      { rootMargin: offset },
    );

    this.observer.observe(element.el.nativeElement);
  }
}
