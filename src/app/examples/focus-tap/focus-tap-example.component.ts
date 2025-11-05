import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-focus-tap-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  templateUrl: './focus-tap-example.component.html'
})
export class FocusTapExampleComponent {
  prevExample = { path: '/examples/repeat', title: 'Repeat' };
  nextExample = { path: '/examples/delay', title: 'Delay' };

  codeExample = `<div
  motionone
  [tabIndex]="0"
  [initial]="{ scale: 1, rotate: 0 }"
  [whileFocus]="{ scale: 1.2, rotate: 180 }"
  [whileTap]="{ scale: 1.3, rotate: 180 }"
  [transition]="{
    duration: 0.3,
    ease: { type: 'spring', stiffness: 400, damping: 10 }
  }"
  class="w-[64px] h-[64px] bg-blue-500 rounded-lg cursor-pointer"
></div>`;
}

