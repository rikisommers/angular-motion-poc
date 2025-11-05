import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-basic-animation-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  templateUrl: './basic-animation-example.component.html'
})
export class BasicAnimationExampleComponent {
  prevExample = { path: '/examples/delay', title: 'Delay' };
  nextExample = { path: '/examples/hover', title: 'Hover Effects' };

  codeExample = `<div
  motionone
  [initial]="{ opacity: 0, scale: 0.5 }"
  [animate]="{ opacity: 1, scale: 1 }"
  [transition]="{ duration: 0.5, ease: 'easeOut' }"
  class="w-[64px] h-[64px] bg-blue-500 rounded-lg"
></div>`;
}