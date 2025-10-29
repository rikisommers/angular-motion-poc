import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';
import { PageNavComponent, NavItem } from '../../components/navigation/page-nav/page-nav.component';

@Component({
  selector: 'app-examples',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective, PageNavComponent],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.scss'
})
export class ExamplesComponent {
  @ViewChildren(MotionOneDirective) motionDirectives!: QueryList<MotionOneDirective>;

  // Navigation content array for page-nav component
  navigationContent: NavItem[] = [
    { id: 'hover', title: 'hover' },
    { id: 'focus', title: 'focus' },
    { id: 'tap', title: 'tap' },
    { id: 'variants', title: 'variants' },

    { id: 'easings', title: 'easings' },
    { id: 'repeat', title: 'repeat' },
    { id: 'delay', title: 'delay' },
    { id: 'timeline', title: 'timeline' },
    { id: 'whileInView', title: 'whileInView' },

    { id: 'staggerChildren', title: 'stagger children' },
  ];

    // Define variants for the interactive square
    squareVariants = {
      idle: { scale: 1, rotate: 0, backgroundColor: '#3b82f6' },
      hover: { scale: 2, rotate: 45, backgroundColor: '#ef4444' },
    };

    // Simple stagger animation data
    staggerWords = ['Staggered', 'text', 'animation', 'example'];

    // Delay animation items (4 items for the loop)
    delayItems = Array.from({ length: 16 }, (_, i) => i);

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

    // Handle navigation clicks with smooth scroll
    onNavClick(event: Event, href: string) {
      event.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        history.pushState(null, '', href);
      }
    }

}
