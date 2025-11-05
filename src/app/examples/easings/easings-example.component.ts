import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-easings-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  templateUrl: './easings-example.component.html'
})
export class EasingsExampleComponent {
  prevExample = { path: '/examples/variants', title: 'Variants' };
  nextExample = { path: '/examples/timeline', title: 'Timeline' };

  codeExample = `<div
  motionone
  [initial]="{ scaleY: 1 }"
  [whileHover]="{ scaleY: 2 }"
  [transition]="{ duration: 0.6, ease: 'linear' }"
  class="w-[64px] h-[64px] bg-yellow-200 rounded-lg"
></div>`;
}

