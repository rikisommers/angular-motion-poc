import { Component, Input, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MotionOneDirective } from 'ngx-motion';

export interface PostImage {
  url: string;
  width: number;
  height: number;
  description: string;
}

export interface Post {
  title: string;
  subtitle: string;
  slug: string;
  client: string;
  date: string;
  tags: string[];
  img?: PostImage;
}

@Component({
  selector: 'app-block-tile-monks',
  imports: [CommonModule, RouterModule, MotionOneDirective],
  templateUrl: './block-tile-monks.component.html',
  styleUrl: './block-tile-monks.component.scss'
})
export class BlockTileMonksComponent implements AfterViewInit {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() slug?: string;
  @Input() client?: string;
  @Input() date?: string;
  @Input() tags?: string[];
  @Input() img?: PostImage;
  @Input() aspect?: string = '';
  @Input() layout?: string = 'col';

  @ViewChild('tileRef') tileRef!: ElementRef;

  isHovered = signal(false);
  isInView = signal(false);

  ngAfterViewInit() {
    // Set up intersection observer for inView detection
    let hasTriggered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (hasTriggered) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isInView.set(true);
            hasTriggered = true;
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (this.tileRef?.nativeElement) {
      observer.observe(this.tileRef.nativeElement);
    }
  }


  get aspectClass() {
    return this.aspect ? `aspect-${this.aspect}` : '';
  }

  get layoutClass() {
    return `flex-${this.layout}`;
  }

  get contentHeightClass() {
    return this.layout === 'col' ? '!h-1/2' : 'h-full';
  }

  get displayTags() {
    return this.tags?.slice(0, 2) || [];
  }

  get routerLinkUrl() {
    return this.slug ? `/articles/${this.slug}` : '/articles';
  }

  get imageAlt() {
    return this.img?.description || `Cover Image for ${this.title || 'Post'}`;
  }
}
