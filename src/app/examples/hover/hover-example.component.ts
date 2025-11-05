import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-hover-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  templateUrl: './hover-example.component.html'
})
export class HoverExampleComponent {
  prevExample = { path: '/examples/basic', title: 'Basic Animation' };
  nextExample = { path: '/examples/text-animation', title: 'Text Animation' };

  codeExample = `<div
  motionone
  [initial]="{ scale: 1, rotate: 0 }"
  [whileHover]="{ scale: 1.2, rotate: 180 }"
  [transition]="{
    duration: 0.3,
    ease: { type: 'spring', stiffness: 400, damping: 10 }
  }"
  class="w-[64px] h-[64px] bg-purple-500 rounded-lg cursor-pointer"
></div>`;
}