import { Directive, ComponentRef, ViewContainerRef, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, ChildrenOutletContexts, ActivatedRoute } from '@angular/router';
import { MotionService } from '../app/services/motion.service';
import { Observable } from 'rxjs';

@Directive({
  selector: 'router-outlet'
})
export class AnimatedRouterOutletDirective extends RouterOutlet {
  constructor(
    private motionService: MotionService
  ) {
    super();
  }

  // Run animations before deactivating a route
  runDeactivation(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.motionService.runAllExitAnimations().subscribe(() => {
        observer.next(true); // Ensure it returns `true` after animations finish
        observer.complete();
      });
    });
  }

  // Run animations when a new route is activated
  runActivation(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
    super.attach(ref,activatedRoute);
    this.motionService.runAllEnterAnimations().subscribe();
  }
}
