import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';
import { TimelineStep } from 'ngx-motion';

@Component({
  selector: 'app-timeline-example',
  imports: [CommonModule, BlockExampleComponent, MotionOneDirective],
  templateUrl: './timeline-example.component.html'
})
export class TimelineExampleComponent {
  prevExample = { path: '/examples/easings', title: 'Easings' };
  nextExample = { path: '/examples/whileinview', title: 'WhileInView' };

  timeline: TimelineStep[] = [
    {
      prop: 'width',
      keyframes: ['64px', '120px', '160px', '80px', '64px'],
      duration: 4,
      atTime: 0.0,
      ease: 'ease-out',
      times: [0, 0.25, 0.5, 0.75, 1],
      repeat: Infinity,
      repeatType: 'loop' as const
    },
    {
      prop: 'backgroundColor',
      keyframes: ['#f00', '#00f', '#f00'],
      duration: 4,
      atTime: 0.5,
      ease: 'ease-in',
      times: [0, 0.5, 1],
      repeat: Infinity,
      repeatType: 'loop' as const
    },
    {
      prop: 'transform',
      keyframes: ['rotate(0deg)', 'rotate(90deg)', 'rotate(180deg)', 'rotate(270deg)', 'rotate(360deg)'],
      duration: 4,
      atTime: 0,
      ease: 'easeInOut',
      times: [0, 0.25, 0.5, 0.75, 1],
      repeat: Infinity,
      repeatType: 'loop' as const
    },
    {
      prop: 'x',
      keyframes: ['0px', '60px', '60px', '0px', '0px'],
      duration: 4,
      atTime: 1,
      ease: 'easeInOut',
      times: [0, 0.25, 0.5, 0.75, 1],
      repeat: Infinity,
      repeatType: 'loop' as const
    },
    {
      prop: 'y',
      keyframes: ['0px', '0px', '-40px', '-40px', '0px'],
      duration: 4,
      atTime: 1,
      ease: 'easeInOut',
      times: [0, 0.25, 0.5, 0.75, 1],
      repeat: Infinity,
      repeatType: 'loop' as const
    }
  ];

  codeExample = `<div
  motionone
  [timeline]="timeline"
  class="h-[64px] w-[64px] bg-yellow-400 rounded-lg"
></div>`;
}

