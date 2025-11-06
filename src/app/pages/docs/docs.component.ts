import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { BlockCodeComponent} from '../../components/blocks/block-code/block-code.component';
import { MotionOneDirective, MotionIfDirective, MotionPresenceDirective } from 'ngx-motion';
import { PageNavComponent, NavItem } from '../../components/navigation/page-nav/page-nav.component';

@Component({
  selector: 'app-docs',
  imports: [CommonModule, BlockExampleComponent, BlockCodeComponent, MotionOneDirective, MotionIfDirective, MotionPresenceDirective, PageNavComponent],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.scss'
})
export class DocsComponent {
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
    { id: 'exitAnimations', title: 'exit animations' },
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

    // Toggle states for exit animations
    showExitExample1 = true;
    showExitExample2 = true;
    showExitExample3 = true;
    showPresenceExample = true;



    // Handle inView trigger
    onInView(animationKey: string) {
      this.animationTriggers[animationKey] = true;
    }

    toggleExitExample(exampleNumber: number) {
      if (exampleNumber === 1) {
        this.showExitExample1 = !this.showExitExample1;
      } else if (exampleNumber === 2) {
        this.showExitExample2 = !this.showExitExample2;
      } else if (exampleNumber === 3) {
        this.showExitExample3 = !this.showExitExample3;
      } else if (exampleNumber === 4) {
        this.showPresenceExample = !this.showPresenceExample;
      }
    }

    // Handle navigation clicks with smooth scroll
    onNavClick(event: Event, href: string) {
      // event.preventDefault();
      // const container = document.getElementById('scrollContainer');
      // const target = document.querySelector(href);
      // if (container && target) {
      //   const containerRect = container.getBoundingClientRect();
      //   const targetRect = target.getBoundingClientRect();
      //   const scrollTop = container.scrollTop + targetRect.top - containerRect.top;

      //   container.scrollTo({
      //     top: scrollTop,
      //     behavior: 'smooth'
      //   });
      //   history.pushState(null, '', href);
      //}
    }

}
