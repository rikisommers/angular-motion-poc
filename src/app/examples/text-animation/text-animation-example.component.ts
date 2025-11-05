import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-text-animation-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  templateUrl: './text-animation-example.component.html'
})
export class TextAnimationExampleComponent {
  prevExample = { path: '/examples/hover', title: 'Hover Effects' };
  nextExample = { path: '/examples/basic', title: 'Basic Animation' };

  staggerWords = ['Staggered', 'Text', 'Animation', 'Example'];

  codeExample = `<div
  class="flex flex-wrap gap-2 justify-center text-2xl font-bold"
  motionone
  [staggerChildren]="0.1"
  [initial]="{}"
  [animate]="{}"
>
  <div
    *ngFor="let word of words; let i = index"
    motionone
    [initial]="{ opacity: 0, y: 20 }"
    [animate]="{ opacity: 1, y: 0 }"
    [transition]="{ duration: 0.6, ease: { type: 'spring', stiffness: 400, damping: 10 } }"
  >
    {{ word }}
  </div>
</div>`;
}