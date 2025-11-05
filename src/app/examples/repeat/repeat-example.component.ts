import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-repeat-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  templateUrl: './repeat-example.component.html'
})
export class RepeatExampleComponent {
  prevExample = { path: '/examples/stagger', title: 'Stagger Children' };
  nextExample = { path: '/examples/focus-tap', title: 'Focus & Tap' };

  Infinity = Infinity;

  codeExample = `<div
  motionone
  [initial]="{ scaleY: 1 }"
  [animate]="{ scaleY: 2 }"
  [transition]="{
    duration: 2,
    ease: 'easeInOutCirc',
    repeat: Infinity,
    repeatType: 'forwards'
  }"
  class="w-[64px] h-[64px] rounded-lg bg-yellow-300"
></div>`;
}

