"use client";

import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MotionOneDirective } from '../../../../directives/motion-one.directive';
import { MotionAnimationService } from '../../../../services/motion-animation.service';

interface Page {
  id: string;
  title: string;
  icon?: string;
  url: string;
}

@Component({
  selector: 'app-text-anim-navigators',
  standalone: true,
  imports: [CommonModule, RouterModule, MotionOneDirective],
  templateUrl: './text-anim-navigators.component.html',
  styleUrl: './text-anim-navigators.component.scss'
})
export class TextAnimNavigatorsComponent implements OnInit {
  @Input() pages: Page[] = [];
  @Input() activePage: string = '';
  @Input() content?: string = '';
  @Input() delay?: number = 0.2;
  @Input() highlight?: string;
  @Input() animateWhenInView: boolean = false;
  @Input() repeatWhenInView: boolean = false;
  @ViewChild('containerRef') containerRef!: ElementRef;

  constructor(private motionAnimation: MotionAnimationService) {}

  gap = 0.03;
  private mousePosition = { x: 0, y: 0 };
  private isMouseInContainer = false;
  private baseSize = 66;
  private maxSize = 90;
  private maxDistance = 200;
  private hoverStates: { [key: string]: number } = {};
  private internalDelay = 0.02;
  private previewsCompleted = 0;
  private totalPreviews = 0;

  get wordsLength(): number {
    return this.content?.split(' ').length || 0;
  }

  get totalDuration(): number {
    return this.wordsLength * this.gap;
  }

  get textDuration(): number {
    return this.totalDuration + this.internalDelay;
  }

  get textTimes(): number[] {
    const t1 = Math.min(this.gap / this.textDuration, 1);
    const t2 = Math.min((this.textDuration - this.internalDelay) / this.textDuration, 1);
    const t3 = Math.min((this.totalDuration + this.gap) / this.totalDuration, 1);
    const t4 = 1;
    return [t1, t2, t3, t4];
  }

  get previewTimes(): number[] {
    const p1 = 0;
    const p2 = Math.min(this.gap / this.totalDuration, 1);
    const p3 = Math.min((this.totalDuration - this.gap) / this.totalDuration, 1);
    const p4 = 1;
    return [p1, p2, p3, p4];
  }

  containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: this.delay || 0
      }
    }
  };

  wordVariants = {
    hidden: { 
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  previewVariants = {
    hidden: { 
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  handleContainerMouseMove(event: MouseEvent) {
    if (!this.containerRef?.nativeElement) return;
    
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    this.mousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    this.pages.forEach(page => {
      const element = document.getElementById(`nav-item-${page.id}`);
      if (!element) return;

      const elementRect = element.getBoundingClientRect();
      const elementCenterX = elementRect.left + elementRect.width / 2;
      const elementCenterY = elementRect.top + elementRect.height / 2;

      const distance = Math.sqrt(
        Math.pow(event.clientX - elementCenterX, 2) +
        Math.pow(event.clientY - elementCenterY, 2)
      );

      if (distance <= this.maxDistance) {
        const scale = 1 - (distance / this.maxDistance);
        this.hoverStates[page.id] = this.baseSize + (this.maxSize - this.baseSize) * scale;
      } else {
        this.hoverStates[page.id] = this.baseSize;
      }
    });
  }

  handleContainerMouseEnter() {
    this.isMouseInContainer = true;
  }

  handleContainerMouseLeave() {
    this.isMouseInContainer = false;
    this.pages.forEach(page => {
      this.hoverStates[page.id] = this.baseSize;
    });
  }

  getNavItemWidth(page: Page): number {
    return this.hoverStates[page.id] || this.baseSize;
  }

  onNavClick(pageId: string) {
    this.activePage = pageId;
  }

  renderDynamicIcon(iconName: string, size: number = 20): string {
    // In Angular, we'll use a different approach for icons
    // This is a placeholder - you'll need to implement your icon system
    return iconName;
  }

  ngOnInit() {
    this.totalPreviews = this.getProcessedWords().length;
  }

  getProcessedWords(): string[] {
    if (!this.content) return [];
    // Strip all formatting and split into words
    return this.content
      .replace(/[__*#`]/g, '') // Remove markdown formatting
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image markdown
      .split(' ')
      .filter(word => word.length > 0); // Remove empty strings
  }

  onPreviewComplete(event: any) {
    this.previewsCompleted++;
    
    // When all previews are complete, start the text animations
    if (this.previewsCompleted === this.totalPreviews) {
      // Start text animations after a small delay
      setTimeout(() => {
        const textElements = this.containerRef.nativeElement.querySelectorAll('.text-element');
        const previewElements = this.containerRef.nativeElement.querySelectorAll('.preview-element');
        
        textElements.forEach((element: HTMLElement, index: number) => {
          // Fade in text
          this.motionAnimation.animate(element, 
            { opacity: 1 },
            { duration: 0.2, delay: index * 0.09, easing: 'ease-out' }
          );
          
          // Simultaneously fade out the corresponding preview
          this.motionAnimation.animate(previewElements[index], 
            { opacity: 0 },
            { duration: 0.2, delay: index * 0.09, easing: 'ease-out' }
          );
        });
      }, 50); // Reduced delay between sequences
    }
  }
}
