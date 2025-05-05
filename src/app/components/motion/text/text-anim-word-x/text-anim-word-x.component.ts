import { Component, Input, OnInit } from '@angular/core';
import { HighlightedSegment } from '../utils/highlighted-segment/text-highlighted-segment.component';
import { motion } from 'framer-motion';
import { processItalicText, isItalic } from '../utils/text-formatting.util';
import { NgFor, NgIf } from '@angular/common';
import { MotionOneDirective } from '../../../../directives/motion-one.directive';
import { spring } from 'motion';
@Component({
  selector: 'app-text-anim-word-x',
  standalone: true,
  imports: [HighlightedSegment, NgFor, NgIf, MotionOneDirective],
  template: `
    <div 
      motionone
      [initial]="containerVariants.hidden"
      [animate]="containerVariants.visible"
    >
    <span class="grid gap-4 relative overflow-hidden">

      <ng-container
        *ngFor="
          let line of (content || '').split(
            '
'
          );
          let lineIndex = index
        "
      >
      <div class="flex items-center gap-2 leading-snug"
      >

        <ng-container
          *ngFor="let segment of line.split('__'); let segmentIndex = index"
            

        >

          <ng-container *ngIf="isImage(segment); else textSegment">
            <img
              motionone
              [variants]="segmentVariants"
              [initial]="'hidden'"
              [animate]="'visible'"
              [src]="getImageUrl(segment)"
              [alt]="getImageAlt(segment)"
              class="inline h-[1em]"
              />
          </ng-container>
          <ng-template #textSegment>
            <ng-container
              *ngIf="segmentIndex % 2 === 0; else highlightedSegment"
            >
              <ng-container *ngIf="isItalic(segment); else regularText">
                <span
                  motionone
                  class="italic"
                  [innerHTML]="processItalic(segment)"                
                  [variants]="segmentVariants"
                  [initial]="'hidden'"
                  [animate]="'visible'"

                ></span>
              </ng-container>
              <ng-template #regularText>
                <span 
                  motionone
                  [variants]="segmentVariants"
                  [initial]="'hidden'"
                  [animate]="'visible'"
                >{{ segment }}</span>
              </ng-template>
            </ng-container>
            <ng-template #highlightedSegment>
              <span
              motionone
              [variants]="segmentVariants"
              [initial]="'hidden'"
              [animate]="'visible'"
              >
                <app-highlighted-segment
                  [segment]="segment"
                  [highlight]="highlight"
                ></app-highlighted-segment>
              </span>
            </ng-template>
          </ng-template>
        </ng-container>
      </div>
      </ng-container>
    </span>
    </div>
  `,
  styleUrls: ['./text-anim-word-x.component.scss'],
})
export class TextAnimWordXComponent implements OnInit {
  @Input() delay: number = 0; // Base delay
  @Input() content: string = ''; // Provide default empty string
  @Input() highlight?: string; // Ensure this is defined
  @Input() type: string = 'text';

  containerVariants = {
    hidden: {},
    visible: {
      transition: {
        duration: 1,
        ease: {
          type: 'spring',
          stiffness: 100,
          damping: 10
        },
        delay:0.6,
        staggerChildren: 0.2,
      },

    },
  };


  segmentVariants = {
    hidden: { opacity: 0, x: 20, y: 100 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 1,
        transition: {
          delay: 0.2,
          duration: 1,
          ease: {
            type: 'spring',
            stiffness: 100,
            damping: 10
          }
        },
    },
    },
  };

  // TextAnimFigma = ({ 
  //   delay = 0, // Base delay
  //   content, 
  //   highlight,
  //   type = "text"
  // }) => {
    
    // segmentVariants = {
    //   hidden: { opacity: 0, x: 10 },
    //   visible: (i) => ({
    //     opacity: 1,
    //     x: 0,
    //     transition: { delay: delay + i * 0.1, duration: 0.3, ease: "easeOut" },
    //   }),
    // };

  constructor() {}

  ngOnInit(): void {
    console.log('Highlight in TextAnimWordX:', this.highlight); // Debugging line
  }

  isImage(segment: string): boolean {
    return /!\[([^\]]*)\]\((.*?)\)/.test(segment);
  }

  getImageUrl(segment: string): string {
    const imageMatch = segment.match(/!\[([^\]]*)\]\((.*?)\)/);
    return imageMatch
      ? imageMatch[2].startsWith('//')
        ? `https:${imageMatch[2]}`
        : imageMatch[2]
      : '';
  }

  getImageAlt(segment: string): string {
    const imageMatch = segment.match(/!\[([^\]]*)\]\((.*?)\)/);
    return imageMatch ? imageMatch[1] : '';
  }

  isItalic(segment: string): boolean {
    const { hasItalic } = processItalicText(segment);
    return hasItalic;
  }

  processItalic(segment: string): string {
    const { processed } = processItalicText(segment);
    return processed;
  }
}
