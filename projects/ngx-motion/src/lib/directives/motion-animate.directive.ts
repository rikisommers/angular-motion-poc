import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  EmbeddedViewRef,
  effect,
  signal,
  DestroyRef,
  inject,
  Injector,
  afterNextRender
} from '@angular/core';

/**
 * Directive that integrates with Angular's control flow to provide
 * enter/exit animations. Works with @if, @for, and other control flow.
 * 
 * Usage:
 * ```html
 * @if (show) {
 *   <div motionAnimate [animateEnter]="enterAnimation" [animateLeave]="leaveAnimation">
 *     Content
 *   </div>
 * }
 * ```
 */
@Directive({
  selector: '[motionAnimate]',
  standalone: true
})
export class MotionAnimateDirective {
  @Input() animateEnter?: () => void;
  @Input() animateLeave?: () => Promise<void>;
  @Input() animateDuration = 300;

  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

  constructor() {
    // Trigger enter animation after render
    afterNextRender(() => {
      if (this.animateEnter) {
        this.animateEnter();
      }
    }, { injector: this.injector });

    // Setup cleanup for exit animation
    this.destroyRef.onDestroy(async () => {
      if (this.animateLeave) {
        await this.animateLeave();
      }
    });
  }
}
