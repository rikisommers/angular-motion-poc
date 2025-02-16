import {
    Directive,
    ContentChildren,
    ViewChildren,
    QueryList,
    Output,
    EventEmitter,
    Input,
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef
} from "@angular/core";
import { MotionDirective } from "./ngx-motion.directive";
import { Router, NavigationEnd } from '@angular/router';
import { MotionService } from '../app/services/motion.service';

@Directive({
    selector: "[animatePresence]",
    standalone: true,
})
export class MotionHostDirective implements AfterContentInit,AfterViewInit {
    @ContentChildren(MotionDirective) motionElements!: QueryList<MotionDirective>;
    @ViewChildren(MotionDirective) directives!: QueryList<MotionDirective>;
    @Output() exitComplete = new EventEmitter<void>();
    @Input() mode: "sync" | "popLayout" | "wait" = "wait";
    @Input() initial = true;

    private animatingElements = new Set<MotionDirective>();

    constructor(
      private router: Router, 
      private cdr: ChangeDetectorRef,
      private motionService: MotionService
    ) {}


    ngAfterContentInit() {
        this.motionElements.forEach((motion) => {
            motion.registerPresence(this);
        });
        console.log("Direct motion elements:", this.motionElements.toArray());
        //console.log("Found route motion elements:", this.routeMotionElements.toArray());
    }

    ngAfterViewInit() {
      this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
              console.log('Navigation ended:', event);
              this.cdr.detectChanges();
  
              const motionElements = this.motionService.getMotionElements();
              if (motionElements.length > 0) {
                  console.log('Directives found:', motionElements);
                  const longestDuration = 2000;
                  console.log('Longest exit duration:', longestDuration);
                } else {
                  console.log('No directives found.');
              }
          }
      });
  }

    startExitAnimation(motion: MotionDirective) {
        this.animatingElements.add(motion);
    }

    completeExitAnimation(motion: MotionDirective) {
        this.animatingElements.delete(motion);
        if (this.animatingElements.size === 0) {
            this.exitComplete.emit();
        }
    }

    getLongestDuration(): number {
        return Math.max(...this.motionElements.map((m) => m.getDuration()));
    }
}
  