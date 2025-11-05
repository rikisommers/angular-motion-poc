import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-variants-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  templateUrl: './variants-example.component.html'
})
export class VariantsExampleComponent {
  prevExample = { path: '/examples/text-animation', title: 'Text Animation' };
  nextExample = { path: '/examples/easings', title: 'Easings' };

  squareVariants = {
    idle: { scale: 1, rotate: 0, backgroundColor: '#3b82f6' },
    hover: { scale: 2, rotate: 45, backgroundColor: '#ef4444' },
  };

  codeExample = `<div
  motionone
  [variants]="squareVariants"
  [initial]="'idle'"
  [animate]="'idle'"
  [whileHover]="squareVariants.hover"
  [transition]="{
    duration: 0.3,
    ease: { type: 'spring', stiffness: 400, damping: 10 }
  }"
  class="w-[64px] h-[64px] bg-yellow-400 rounded-lg cursor-pointer"
></div>`;
}

