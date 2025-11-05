import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-stagger-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  templateUrl: './stagger-example.component.html'
})
export class StaggerExampleComponent {
  prevExample = { path: '/examples/whileinview', title: 'WhileInView' };
  nextExample = { path: '/examples/repeat', title: 'Repeat' };

  staggerWords = ['Staggered', 'text', 'animation', 'example'];

  codeExample = `<div
  motionone
  [runInView]="'always'"
  [staggerChildren]="0.1"
  [initial]="{}"
  [animate]="{}"
  class="flex flex-wrap gap-2 justify-center"
>
  <div
    motionone
    [initial]="{ opacity: 0, y: 20 }"
    [animate]="{ opacity: 1, y: 0 }"
    [transition]="{ duration: 0.6, ease: { type: 'spring', stiffness: 400, damping: 10 } }"
  >
    Item
  </div>
</div>`;
}

