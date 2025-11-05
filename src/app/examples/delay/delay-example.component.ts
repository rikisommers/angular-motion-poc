import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-delay-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  templateUrl: './delay-example.component.html'
})
export class DelayExampleComponent {
  prevExample = { path: '/examples/focus-tap', title: 'Focus & Tap' };
  nextExample = { path: '/examples/basic', title: 'Basic Animation' };

  delayItems = Array.from({ length: 16 }, (_, i) => i);
  Infinity = Infinity;

  codeExample = `<div
  motionone
  [initial]="{ scaleY: 1 }"
  [animate]="{ scaleY: 2 }"
  [transition]="{
    duration: 1,
    ease: 'easeInOutCirc',
    delay: 0.4,
    repeat: Infinity,
    repeatType: 'mirror'
  }"
  class="w-4 h-[40px] rounded-lg bg-yellow-300"
></div>`;
}

