import { Component, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTransitionComponent } from '../../components/transition/page-transition/page-transition.component';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { DialogComponent } from '../../components/base/dialog/dialog.component';
import { ButtonComponent } from '../../components/base/button/button.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-examples',
  imports: [CommonModule, PageTransitionComponent, BlockExampleComponent, DialogComponent, ButtonComponent, MotionOneDirective ],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.scss'
})
export class ExamplesComponent {
  @ViewChild('exampleDialog') exampleDialog!: DialogComponent;
  @ViewChildren(MotionOneDirective) motionDirectives!: QueryList<MotionOneDirective>;

    // Define variants for the interactive square
    squareVariants = {
      idle: { scale: 1, rotate: 0, backgroundColor: '#3b82f6' },
      hover: { scale: 1.1, rotate: 45, backgroundColor: '#ef4444' },
    };

    // Simple stagger animation data
    staggerWords = ['Staggered', 'text', 'animation', 'example'];

    // Make Infinity available in template
    Infinity = Infinity;

    // Animation trigger states
    animationTriggers: { [key: string]: boolean } = {
      variants: false,
      fadeScale: false,
      timeline: false,
      hover: false,
      repeat: false,
      stagger: true, // Start with stagger animation visible
      easings: false,
      inView: false,
      focus: false
    };

    // Retrigger animation - restart all motion directives
    retriggerAnimation(animationKey: string) {
      console.log('[Examples] Retriggering animations for:', animationKey);

      // Find and restart all motion directives
      if (this.motionDirectives) {
        this.motionDirectives.forEach((directive: MotionOneDirective) => {
          console.log('[Examples] Restarting directive:', directive.elementId);
          directive.restartAnimation();
        });
      }

      // Also force change detection as fallback
      this.animationTriggers = { ...this.animationTriggers };
    }

    // Handle inView trigger
    onInView(animationKey: string) {
      this.animationTriggers[animationKey] = true;
    }

    // Individual retrigger methods for each animation
    retriggerVariants = () => this.retriggerAnimation('variants');
    retriggerFadeScale = () => this.retriggerAnimation('fadeScale');
    retriggerTimeline = () => this.retriggerAnimation('timeline');
    retriggerHover = () => this.retriggerAnimation('hover');
    retriggerRepeat = () => this.retriggerAnimation('repeat');
    retriggerStagger = () => this.retriggerAnimation('stagger');
    retriggerEasings = () => this.retriggerAnimation('easings');
    retriggerInView = () => this.retriggerAnimation('inView');
    retriggerFocus = () => this.retriggerAnimation('focus');
    retriggerInViewOptions = () => this.retriggerAnimation('inViewOptions');

  


  async showDialog(): Promise<void> {
    await this.exampleDialog.openDialog();
  }

  async hideDialog(): Promise<void> {
    await this.exampleDialog.closeDialog();
  }
}
