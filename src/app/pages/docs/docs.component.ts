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

  // Code examples
  hoverCode = `<div
  motionone
  [initial]="{ scale: 1, rotate: 0 }"
  [whileHover]="{ scale: 1.2, rotate: 180 }"
  [transition]="{
    duration: 0.3,
    ease: { type: 'spring', stiffness: 400, damping: 10 }
  }"
  class="w-[64px] h-[64px] bg-purple-500 rounded-lg cursor-pointer"
></div>`;

  focusTapCode = `<div
  motionone
  [tabIndex]="0"
  [initial]="{ scale: 1, rotate: 0 }"
  [whileFocus]="{ scale: 1.2, rotate: 180 }"
  [transition]="{
    duration: 0.3,
    ease: { type: 'spring', stiffness: 400, damping: 10 }
  }"
  class="w-[64px] h-[64px] bg-purple-500 rounded-lg cursor-pointer"
></div>`;

  variantsCode = `squareVariants = {
  idle: { scale: 1, rotate: 0, backgroundColor: '#3b82f6' },
  hover: { scale: 2, rotate: 45, backgroundColor: '#ef4444' },
};

<div
  motionone
  [variants]="squareVariants"
  [initial]="'idle'"
  [whileHover]="'hover'"
  class="w-[64px] h-[64px] cursor-pointer"
></div>`;

  easingsCode = `<div
  motionone
  [initial]="{ x: -100 }"
  [animate]="{ x: 100 }"
  [transition]="{ 
    duration: 2, 
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'reverse'
  }"
  class="w-[64px] h-[64px] bg-blue-500 rounded-lg"
></div>`;

  timelineCode = `<div
  motionone
  [initial]="{ opacity: 0, y: 50 }"
  [animate]="{ 
    opacity: [0, 1, 1],
    y: [50, 0, 0],
    scale: [1, 1.2, 1]
  }"
  [transition]="{ 
    duration: 1,
    times: [0, 0.5, 1],
    ease: 'easeOut'
  }"
  class="px-24 py-16 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
>
  Timeline Animation
</div>`;

  whileInViewCode = `<div
  motionone
  [initial]="{ opacity: 0, scale: 0.5 }"
  [whileInView]="{ opacity: 1, scale: 1 }"
  [transition]="{ duration: 0.5, ease: 'easeOut' }"
  class="w-[64px] h-[64px] bg-green-500 rounded-lg"
></div>`;

  staggerCode = `staggerWords = ['Staggered', 'text', 'animation', 'example'];

<div
  motionone
  [initial]="{ opacity: 0 }"
  [animate]="{ opacity: 1 }"
  [transition]="{ staggerChildren: 0.1 }"
  class="flex gap-8"
>
  @for (word of staggerWords; track word) {
    <span
      motionone
      [initial]="{ opacity: 0, y: 20 }"
      [animate]="{ opacity: 1, y: 0 }"
      class="text-2xl font-bold text-white"
    >
      {{ word }}
    </span>
  }
</div>`;

  delayCode = `delayItems = Array.from({ length: 16 }, (_, i) => i);

<div class="grid grid-cols-4 gap-8">
  @for (item of delayItems; track item) {
    <div
      motionone
      [initial]="{ opacity: 0, scale: 0 }"
      [animate]="{ opacity: 1, scale: 1 }"
      [transition]="{ delay: item * 0.05, duration: 0.3 }"
      class="w-[64px] h-[64px] bg-blue-500 rounded-lg"
    ></div>
  }
</div>`;

  repeatCode = `<div
  motionone
  [initial]="{ rotate: 0 }"
  [animate]="{ rotate: 360 }"
  [transition]="{ 
    duration: 2,
    repeat: Infinity,
    ease: 'linear'
  }"
  class="w-[64px] h-[64px] bg-purple-500 rounded-lg"
></div>`;

  exitAnimationsCode = `<div *motionIf="showExitExample1">
  <div
    motionone
    [initial]="{ opacity: 0, scale: 0.5 }"
    [animate]="{ opacity: 1, scale: 1 }"
    [exit]="{ opacity: 0, scale: 0.5 }"
    [transition]="{ duration: 0.3, ease: 'easeOut' }"
    class="px-24 py-16 text-white bg-purple-500 rounded-lg"
  >
    Fade & Scale Animation
  </div>
</div>`;

  // Getting started code snippets
  gettingStartedInstallCode = `npm install @hilux/ngx-motion motion\n\n# or with yarn\nyarn add @hilux/ngx-motion motion`;

  gettingStartedImportCode = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionOneDirective, MotionIfDirective, MotionPresenceDirective } from '@hilux/ngx-motion';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, MotionOneDirective, MotionIfDirective, MotionPresenceDirective],
  template: \`
    <div
      motionone
      [initial]="{ opacity: 0, y: 20 }"
      [animate]="{ opacity: 1, y: 0 }"
      [transition]="{ duration: 0.4, ease: 'easeOut' }"
      class="w-[64px] h-[64px] bg-blue-500 rounded-lg"
    ></div>
  \`
})
export class ExampleComponent {}`;

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
      event.preventDefault();
      const container = document.getElementById('scrollContainer');
      const target = document.querySelector(href);
      if (container && target) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const scrollTop = container.scrollTop + targetRect.top - containerRect.top;

        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
        history.pushState(null, '', href);
      }
    }

}
