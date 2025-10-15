import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { MotionOneDirective } from './motion-one.directive';

@Directive({
  selector: '[motionIf]',
  standalone: true
})
export class MotionIfDirective implements OnDestroy {
  private hasView = false;
  private motionElement: MotionOneDirective | null = null;
  private exitTimeout: any;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set motionIf(condition: boolean) {
    // When condition becomes true and view doesn't exist
    if (condition && !this.hasView) {
      // Create the view
      const view = this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
      
      // Find the motion directive in the created view
      setTimeout(() => {
        const element = view.rootNodes[0];
        if (element) {
          this.motionElement = (element as any)._motionDirective || null;
        }
      });
    } 
    // When condition becomes false and view exists
    else if (!condition && this.hasView) {
      // If we have a motion element with exit animation
      if (this.motionElement && this.motionElement.exit && 
          Object.keys(this.motionElement.exit).length > 0) {
        
        // Run exit animation
        this.motionElement.runExitAnimation();
        
        // Clear any existing timeout
        if (this.exitTimeout) {
          clearTimeout(this.exitTimeout);
        }
        
        // Get duration from the motion element
        const duration = this.motionElement.getDuration() || 1000;
        
        // Remove the view after animation completes
        this.exitTimeout = setTimeout(() => {
          if (this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
            this.motionElement = null;
          }
        }, duration);
      } else {
        // No exit animation, remove immediately
        this.viewContainer.clear();
        this.hasView = false;
        this.motionElement = null;
      }
    }
  }

  ngOnDestroy() {
    if (this.exitTimeout) {
      clearTimeout(this.exitTimeout);
    }
  }
} 