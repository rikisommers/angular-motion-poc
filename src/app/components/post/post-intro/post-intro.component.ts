// src/app/components/post/post-intro/post-intro.component.ts
import { Component, Input, OnInit} from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { AnimatedTextComponent } from '../../motion/text/animated-text.component';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-post-intro',
  standalone: true,
  imports: [NgIf, NgStyle, AnimatedTextComponent],
  template: `
    <div class="z-10 grid items-end content-end w-full grid-cols-12 gap-6 relative">

      <div class="col-span-12 md:col-span-8 lg:col-span-8">
      <h1>Hightlt:{{currentTheme?.textHighlight}}</h1>
      <h1>Adnim:{{currentTheme?.textAnimation}}</h1>

          <div *ngIf="tag"
            class="inline-flex px-2 py-1 mb-8 ml-2 text-xs font-medium uppercase rounded-full"
            style="color: var(--textAccent); background-color: var(--bodyBackgroundColor);"
          >
            {{ tag }}
          </div>
          <!-- <ng-container *ngIf="tag">
        </ng-container> -->
        <ng-container *ngIf="title">
          <h1 class="text-4xl leading-normal text-balance">
            <app-animated-text
              [content]="title"
              [type]="currentTheme?.textAnimation"
              [highlight]="currentTheme?.textHighlight"
              [delay]="1"
            ></app-animated-text>
          </h1>
        </ng-container>
      </div>
      <div class="col-span-12 text-left md:col-span-8 lg:col-span-4 text-balance">
        <h4 class="text-sm font-normal" style="color: var(--subtext-color);">
          <ng-container *ngIf="content">
            <app-animated-text
              [type]="currentTheme?.textAnimationSec"
              [content]="content"
              [highlight]="currentTheme?.textHighlight"
              [delay]="3"
            ></app-animated-text>
          </ng-container>
        </h4>
      </div>
    </div>
  `,
})
export class PostIntroComponent implements OnInit {
  @Input() title?: string;
  @Input() content?: string;
  @Input() tag?: string;
  currentTheme: any; // Define a proper type for currentTheme

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.currentTheme = this.themeService.getThemeData();
    
    // Log the entire currentTheme object
    console.log('Current Theme:', this.currentTheme);
    
    // Check if currentTheme and its data are defined before logging
    if (this.currentTheme) {
      console.log('Text Animation:', this.currentTheme.textAnimation);
      console.log('Text Highlight:', this.currentTheme.textHighlight);
    } else {
      console.error('Current theme data is not defined.');
    }
  }
}