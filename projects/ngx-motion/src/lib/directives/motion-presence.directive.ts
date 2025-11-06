import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  EmbeddedViewRef,
  ElementRef,
  effect,
  signal,
  DestroyRef,
  inject,
  ChangeDetectorRef,
  Renderer2
} from '@angular/core';
import { MotionOneDirective } from './motion-one.directive';

/**
 * Enhanced structural directive for animated presence with proper lifecycle management.
 * Automatically handles enter and exit animations for elements added/removed from DOM.
 * 
 * Supports multiple integration patterns:
 * 
 * Pattern 1 - Direct with motionone directive:
 * ```html
 * <div *motionPresence="show">
 *   <div motionone 
 *        [initial]="{ opacity: 0 }" 
 *        [animate]="{ opacity: 1 }"
 *        [exit]="{ opacity: 0 }">
 *     Content
 *   </div>
 * </div>
 * ```
 * 
 * Pattern 2 - With animation callbacks:
 * ```html
 * <div *motionPresence="show; onEnter: handleEnter; onExit: handleExit">
 *   Content
 * </div>
 * ```
 */
@Directive({
  selector: '[motionPresence]',
  standalone: true
})
export class MotionPresenceDirective {
  private hasView = false;
  private currentView: EmbeddedViewRef<any> | null = null;
  private exitTimeout: any;
  private destroyRef = inject(DestroyRef);

  @Input() motionPresenceOnEnter?: () => void;
  @Input() motionPresenceOnExit?: () => Promise<void>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private cdr: ChangeDetectorRef
  ) {
    this.destroyRef.onDestroy(() => {
      if (this.exitTimeout) {
        clearTimeout(this.exitTimeout);
      }
    });
  }

  @Input() set motionPresence(condition: boolean) {
    if (condition && !this.hasView) {
      this.enter();
    } else if (!condition && this.hasView) {
      this.exit();
    }
  }

  private enter() {
    this.currentView = this.viewContainer.createEmbeddedView(this.templateRef);
    this.hasView = true;
    this.cdr.detectChanges();

    // Wait for view to be rendered
    setTimeout(() => {
      if (this.motionPresenceOnEnter) {
        this.motionPresenceOnEnter();
      }
      
      // Find and trigger motion directive if present
      const motionElements = this.findMotionDirectives(this.currentView);
      motionElements.forEach(directive => {
        if (directive.runInitAnimation) {
          directive.runInitAnimation();
        }
      });
    }, 0);
  }

  private async exit() {
    if (!this.hasView || !this.currentView) return;

    // Find motion directives for exit animation
    const motionElements = this.findMotionDirectives(this.currentView);
    
    if (motionElements.length > 0) {
      // Wait for exit animations
      const exitPromises = motionElements
        .filter(directive => directive.exit && Object.keys(directive.exit).length > 0)
        .map(directive => directive.runExitAnimation());
      
      if (exitPromises.length > 0) {
        await Promise.all(exitPromises);
      }
    }

    if (this.motionPresenceOnExit) {
      await this.motionPresenceOnExit();
    }

    this.viewContainer.clear();
    this.hasView = false;
    this.currentView = null;
  }

  private findMotionDirectives(view: EmbeddedViewRef<any> | null): MotionOneDirective[] {
    if (!view) return [];
    
    const directives: MotionOneDirective[] = [];
    
    view.rootNodes.forEach((node: any) => {
      if (node?._motionDirective) {
        directives.push(node._motionDirective);
      }
      
      // Search children
      if (node?.querySelectorAll) {
        const elements = node.querySelectorAll('[motionone]');
        elements.forEach((el: any) => {
          if (el._motionDirective) {
            directives.push(el._motionDirective);
          }
        });
      }
    });
    
    return directives;
  }
}
