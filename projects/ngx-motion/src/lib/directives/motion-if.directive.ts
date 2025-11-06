import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, EmbeddedViewRef, ChangeDetectorRef } from '@angular/core';
import { MotionOneDirective } from './motion-one.directive';

/**
 * Structural directive for animated presence with proper enter/exit lifecycle.
 * Works with the existing motionone directive's animate and exit properties.
 * 
 * Usage:
 * ```html
 * <div *motionIf="isVisible">
 *   <div motionone 
 *        [initial]="{ opacity: 0, scale: 0.8 }" 
 *        [animate]="{ opacity: 1, scale: 1 }"
 *        [exit]="{ opacity: 0, scale: 0.8 }">
 *     Content that animates in and out
 *   </div>
 * </div>
 * ```
 */
@Directive({
  selector: '[motionIf]',
  standalone: true
})
export class MotionIfDirective implements OnDestroy {
  private hasView = false;
  private currentView: EmbeddedViewRef<any> | null = null;
  private motionDirectives: MotionOneDirective[] = [];
  private exitTimeout: any;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() set motionIf(condition: boolean) {
    if (condition && !this.hasView) {
      this.enter();
    } else if (!condition && this.hasView) {
      this.exit();
    }
  }

  private enter() {
    // Create the view
    this.currentView = this.viewContainer.createEmbeddedView(this.templateRef);
    this.hasView = true;
    this.cdr.detectChanges();
    
    // Find all motion directives in the created view
    setTimeout(() => {
      this.motionDirectives = this.findMotionDirectives(this.currentView);
      
      // Trigger enter animations
      this.motionDirectives.forEach(directive => {
        if (directive.runInitAnimation) {
          directive.runInitAnimation();
        }
      });
    }, 0);
  }

  private exit() {
    if (!this.hasView || !this.currentView) return;

    // Find all motion directives that have exit animations
    const directivesWithExit = this.motionDirectives.filter(
      directive => directive.exit && Object.keys(directive.exit).length > 0
    );
    
    if (directivesWithExit.length > 0) {
      // Run all exit animations
      const exitPromises = directivesWithExit.map(directive => 
        directive.runExitAnimation()
      );
      
      // Get the longest duration
      const maxDuration = Math.max(
        ...directivesWithExit.map(d => d.getDuration()),
        300
      );
      
      // Clear any existing timeout
      if (this.exitTimeout) {
        clearTimeout(this.exitTimeout);
      }
      
      // Remove the view after all animations complete
      this.exitTimeout = setTimeout(() => {
        this.clearView();
      }, maxDuration);
    } else {
      // No exit animation, remove immediately
      this.clearView();
    }
  }

  private clearView() {
    if (this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
      this.currentView = null;
      this.motionDirectives = [];
    }
  }

  private findMotionDirectives(view: EmbeddedViewRef<any> | null): MotionOneDirective[] {
    if (!view) return [];
    
    const directives: MotionOneDirective[] = [];
    
    view.rootNodes.forEach((node: any) => {
      // Check if root node has motion directive
      if (node?._motionDirective) {
        directives.push(node._motionDirective);
      }
      
      // Search children recursively
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

  ngOnDestroy() {
    if (this.exitTimeout) {
      clearTimeout(this.exitTimeout);
    }
    this.clearView();
  }
} 