import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';

@Component({
  selector: 'app-basic-animation-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  template: `
    <div class="p-8">
      <block-example
        title="Basic Animation"
        description="Simple fade and scale animations."
        language="html"
      >
        <div content class="flex justify-center items-center">
          <div
            motionone
            [initial]="{ opacity: 0, scale: 0.5 }"
            [animate]="{ opacity: 1, scale: 1 }"
            [transition]="{ duration: 0.5, ease: 'easeOut' }"
            class="w-[64px] h-[64px] bg-blue-500 rounded-lg"
          ></div>
        </div>

        <ng-template #code>
          {{ codeExample }}
        </ng-template>
      </block-example>
    </div>
  `
})
export class BasicAnimationExampleComponent {
  codeExample = `<div
  motionone
  [initial]="{ opacity: 0, scale: 0.5 }"
  [animate]="{ opacity: 1, scale: 1 }"
  [transition]="{ duration: 0.5, ease: 'easeOut' }"
  class="w-[64px] h-[64px] bg-blue-500 rounded-lg"
></div>`;
}