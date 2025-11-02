// src/app/components/post/post-intro/post-intro.component.ts
import { Component, Input, OnInit} from '@angular/core';
import { NgIf } from '@angular/common';
import { AnimatedTextComponent } from '../../motion/text/animated-text.component';
import { ThemeService } from '../../../services/theme.service';
import { TextAnimLineUpComponent } from '../../motion/text/text-anim-line-up/text-line-up.component';
@Component({
  selector: 'app-post-intro',
  standalone: true,
  imports: [NgIf, AnimatedTextComponent, TextAnimLineUpComponent],
  template: `

      <div class="flex flex-col justify-center items-center max-w-containerWidth">

      <!-- <div *ngIf="tag"
            class="inline-flex px-2 py-1 text-xs font-medium uppercase rounded-full"
            style="color: var(--textAccent); background-color: var(--bodyBackgroundColor);"
          >
            {{ tag }}
          </div> -->

          <h1 *ngIf="title" class="text-6xl leading-normal text-center text-balance">
            <!-- <app-animated-text
              [content]="title"
              [type]="currentTheme?.textAnimation"
              [highlight]="currentTheme?.textHighlight"
            ></app-animated-text> -->
            <app-text-anim-line-up
          [content]="title" 
          [delay]="0" 
        [highlight]="'background'"/>
          </h1>
        <h4 *ngIf="content" class="text-xl font-normal text-center" style="color: var(--subtext-color);">
           
              <!-- <app-animated-text
                [type]="currentTheme?.textAnimationSec"
                [content]="content"
                [highlight]="currentTheme?.textHighlight"
                
              ></app-animated-text>
               -->
               <app-text-anim-line-up
          [content]="content" 
          [delay]="0" 
        [highlight]="'background'"/>
            
          </h4>
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