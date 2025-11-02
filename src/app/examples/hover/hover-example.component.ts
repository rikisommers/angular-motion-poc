import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-hover-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  template: `
    <div class="p-8">
      <block-example
        title="Hover Effects"
        description="Different hover animations and interactions."
      >
        <div content class="flex gap-16 justify-center items-center">
          <div
            motionone
            [initial]="{ scale: 1, rotate: 0 }"
            [whileHover]="{ scale: 1.2, rotate: 180 }"
            [transition]="{
              duration: 0.3,
              ease: { type: 'spring', stiffness: 400, damping: 10 }
            }"
            class="w-[64px] h-[64px] bg-purple-500 rounded-lg cursor-pointer"
          ></div>

          <div
            motionone
            [initial]="{ y: '0', boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)' }"
            [whileHover]="{
              y: -10,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }"
            [transition]="{
              duration: 0.3,
              ease: { type: 'spring', stiffness: 400, damping: 10 }
            }"
            class="w-[64px] h-[64px] bg-green-500 rounded-lg cursor-pointer"
          ></div>

          <div
            motionone
            [initial]="{ borderRadius: '10px', backgroundColor: '#3b82f6' }"
            [whileHover]="{ borderRadius: '50%', backgroundColor: '#ef4444' }"
            [transition]="{ duration: 0.3, ease: 'easeInOut' }"
            class="w-[64px] h-[64px] rounded-lg cursor-pointer"
          ></div>
        </div>

        <ng-template #code>
          <pre class="text-sm">{{ codeExample }}</pre>
        </ng-template>
      </block-example>
    </div>
  `
})
export class HoverExampleComponent {
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