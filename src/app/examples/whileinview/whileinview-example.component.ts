import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-whileinview-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  templateUrl: './whileinview-example.component.html'
})
export class WhileinviewExampleComponent {
  prevExample = { path: '/examples/timeline', title: 'Timeline' };
  nextExample = { path: '/examples/stagger', title: 'Stagger Children' };

  codeExample = `<div
  motionone
  [initial]="{ opacity: 0, scale: 1, rotate: 0, backgroundColor: '#3b82f6' }"
  [whileInView]="{ opacity: 1, scale: 2, rotate: 45, backgroundColor: '#ef4444' }"
  [transition]="{ duration: 0.6, ease: { type: 'spring', stiffness: 400, damping: 10 } }"
  class="w-[64px] h-[64px] bg-purple-500 rounded-lg cursor-pointer"
></div>`;
}

