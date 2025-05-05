import { MotionOneDirective } from '../../../../directives/motion-one.directive';
import { HighlightedSegment } from '../utils/highlighted-segment/text-highlighted-segment.component';
import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { transform } from 'motion';

@Component({
  selector: 'app-text-anim-line-up',
  standalone: true,
  imports: [MotionOneDirective, NgFor, NgIf, HighlightedSegment],
  template: `
    <div
      motionone
      [initial]="containerVariants.hidden"
      [animate]="containerVariants.visible"
    >
      <span class="inline-block relative overflow-hidden">
        <ng-container
          *ngFor="
            let line of content.split(
              '
'
            );
            let lineIndex = index
          "
        >
          <div
            motionone
            [variants]="lineVariants"
            [initial]="'hidden'"
            [animate]="'visible'"
            style="overflow: hidden; position: relative;"
            class="block leading-snug"
          >
            line
            <ng-container
              *ngFor="let segment of line.split('__'); let segmentIndex = index"
            >
              <ng-container
                *ngIf="isImage(segment, segmentIndex); else textSegment"
              >
                <img
                  [src]="getImageUrl(segment)"
                  [alt]="getAltText(segment)"
                  class="absolute w-[40px] h-0"
                  style="max-width: 40px; height: auto; display: inline-block;"
                />
              </ng-container>
              <ng-template #textSegment>
                <span *ngIf="isItalic(segment); else regularText">
                  {{ processItalicText(segment) }}</span
                >
                <ng-template #regularText>
                  <app-highlighted-segment
                    *ngIf="segmentIndex % 2 !== 0"
                    [segment]="segment"
                    [highlight]="highlight"
                  ></app-highlighted-segment>
                  <span *ngIf="segmentIndex % 2 === 0">{{ segment }}</span>
                </ng-template>
              </ng-template>
            </ng-container>
          </div>
        </ng-container>
      </span>
    </div>
  `,
})
export class TextAnimLineUpComponent {
  @Input() delay!: number;
  @Input() content!: string;
  @Input() highlight: any;
  @Input() animateWhenInView = false;
  @Input() repeatWhenInView = false;
  @ViewChild('container') container!: ElementRef;

  isInView = false; // Logic to determine if in view should be implemented

  containerVariants = {
    hidden: {},
    visible: {
      transition: {
        duration: 5,
        ease: 'ease-in',
        delay: 0.6,
        staggerChildren: 0.8,
      },
    },
  };

  lineVariants = {
    hidden: {
      y: '40px',
      transform: 'translateY(40px)',
      opacity: 0,
    },
    visible: {
      y: 0,
      transform: 'translateY(0px)',
      opacity: 1,
      transition: {
        duration: 2,
        ease: [0.33, 1, 0.68, 1],
        opacity: {
          duration: 1.5,
          delay: 1,
          ease: 'easeOut',
        },
      },
    },
  };

  isImage(segment: string, segmentIndex: number): boolean {
    return !!segment.match(/!\[([^\]]*)\]\((.*?)\)/);
  }

  getImageUrl(segment: string): string {
    const imageMatch = segment.match(/!\[([^\]]*)\]\((.*?)\)/);
    if (!imageMatch) return '';
    return imageMatch[2].startsWith('//')
      ? `https:${imageMatch[2]}`
      : imageMatch[2];
  }

  getAltText(segment: string): string {
    const imageMatch = segment.match(/!\[([^\]]*)\]\((.*?)\)/);
    return imageMatch ? imageMatch[1] : '';
  }

  isItalic(segment: string): boolean {
    // Implement logic to check for italic formatting
    return false; // Placeholder
  }

  processItalicText(segment: string): string {
    // Implement logic to process italic text
    return segment; // Placeholder
  }
}
