// src/app/components/post/post-intro/post-intro.component.ts
import { Component, Input, OnInit} from '@angular/core';
import { NgIf } from '@angular/common';
import { AnimatedTextComponent } from '../../motion/text/animated-text.component';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-post-intro',
  standalone: true,
  imports: [NgIf, AnimatedTextComponent],
  template: `
    <div class="z-10 grid items-start justify-end w-full flex-grow gap-1 relative">

      <div class="flex flex-col items-start justify-center w-[600px]">

     
          <!-- <ng-container *ngIf="tag">
        </ng-container> -->
        <ng-container *ngIf="title">
          <h1 class="text-4xl leading-normal text-balance">
            <app-animated-text
              [content]="title"
              [type]="currentTheme?.textAnimation"
              [highlight]="currentTheme?.textHighlight"
              [delay]="4"
            ></app-animated-text>
          </h1>
        </ng-container>
      </div>
      <div class="text-balance flex items-center gap-1 w-[600px]">
        <div *ngIf="tag"
            class="inline-flex px-2 py-1 text-xs font-medium uppercase rounded-full"
            style="color: var(--textAccent); background-color: var(--bodyBackgroundColor);"
          >
            {{ tag }}
          </div>
          <h4 class="text-sm font-normal" style="color: var(--subtext-color);">
            <ng-container *ngIf="content">
              <app-animated-text
                [type]="currentTheme?.textAnimationSec"
                [content]="content"
                [highlight]="currentTheme?.textHighlight"
                [delay]="4"
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
    this.currentTheme = this.themeService.currentTheme;
    
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