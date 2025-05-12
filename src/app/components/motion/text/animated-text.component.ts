import { Component, Input, OnInit } from '@angular/core';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { themes } from '../../../utils/theme';
import { TextAnimLineUpComponent } from './text-anim-line-up/text-line-up.component';
import { TextAnimWordXComponent } from './text-anim-word-x/text-anim-word-x.component';
import { TextAnimNavigatorsComponent } from './text-anim-navigators/text-anim-navigators.component';
import { ThemeService } from '../../../services/theme.service';
import { textAnimationThemes } from '../../../utils/theme';

// const AnimStyle = {
//   NONE: 'none',
//   FIGMA: 'figma',
//   LINESUP: 'linesup',
//   LINEPOSUP: 'lineposup',
//   LINEFADEIN: 'linefadein',
//   CHARFADE: 'charfade',
//   CHARBLUR: 'charblur',
//   CHARRANDOM: 'charrandom',
//   CHARCODE: 'charcode',
// };

// const AnimTextOrder = {
//   ONE: 0,
//   TWO: 0.3,
//   THREE: 0.6,
//   FOUR: 0.9,
//   FIVE: 1.2,
// };

@Component({
  selector: 'app-animated-text',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    TextAnimLineUpComponent,
    TextAnimWordXComponent,
    TextAnimNavigatorsComponent
  ],
  template: `
  <!-- <h1>HL: {{highlight}}</h1> -->
    <ng-container *ngIf="content">
           <!-- <app-text-anim-word-x
          [content]="content"
          [delay]="delay || 0"
          [highlight]="highlight"
        ></app-text-anim-word-x> -->
        <app-text-anim-navigators
          [content]="content"
          [delay]="2"
          [highlight]="highlight"
        ></app-text-anim-navigators>

      <ng-container [ngSwitch]="type">
        <!-- <app-text-anim-figma *ngSwitchCase="AnimStyle.FIGMA" [content]="content" [highlight]="highlight2"></app-text-anim-figma>
        <app-text-anim-none *ngSwitchCase="AnimStyle.NONE" [content]="content" [highlight]="highlight2"></app-text-anim-none>
        <app-text-anim-line-pos-up *ngSwitchCase="AnimStyle.LINESUP" [content]="content" [delay]="delay" [highlight]="highlight2"></app-text-anim-line-pos-up>
        <app-text-anim-line-fade *ngSwitchCase="AnimStyle.LINEFADEIN" [content]="content" [delay]="delay" [highlight]="highlight2"></app-text-anim-line-fade>
        <app-text-anim-linear *ngSwitchCase="AnimStyle.CHARFADE" [content]="content" [delay]="delay" [highlight]="highlight2"></app-text-anim-linear>
        <app-text-anim-blur *ngSwitchCase="AnimStyle.CHARBLUR" [content]="content" [delay]="delay" [highlight]="highlight2"></app-text-anim-blur>
        <app-text-anim-random *ngSwitchCase="AnimStyle.CHARRANDOM" [content]="content"></app-text-anim-random>
        <app-text-anim-code *ngSwitchCase="AnimStyle.CHARCODE" [content]="content"></app-text-anim-code> -->
        <!-- <app-text-anim-word-x
          *ngSwitchCase="textAnimationOptions.wordx"
          [content]="content"
          [delay]="delay || 0"
          [highlight]="highlight"
        ></app-text-anim-word-x> -->

        <!-- <app-text-anim-navigators
          *ngSwitchCase="textAnimationOptions.navigators"
          [content]="content"
          [delay]="delay || 0"
          [highlight]="highlight"
        ></app-text-anim-navigators>

        <app-text-anim-line-up
          *ngSwitchCase="textAnimationOptions.linesup"
          [content]="content"
          [delay]="delay || 0"
          [highlight]="highlight"
        ></app-text-anim-line-up>

        <app-text-anim-line-up
          *ngSwitchDefault
          [content]="content"
          [delay]="delay || 0"
          [highlight]="highlight"
        ></app-text-anim-line-up> -->
      </ng-container>
      <!-- <app-text-anim-line-up  
        [content]="content || 'ddsadasd'" 
        [delay]="delay || 0" 
        [highlight]="highlight">
      </app-text-anim-line-up> -->
    </ng-container>
  `,
})
export class AnimatedTextComponent {
  @Input() type?: string;
  @Input() highlight?: string;
  @Input() content?: string;
  @Input() delay?: number;

  textAnimationOptions = textAnimationThemes;
  // constructor(private themeService: ThemeService) {
  //   this.highlight2 = this.getCurrentThemeHighlight();
  // }

  // private getCurrentThemeHighlight(): string {
  //   return this.themeService.getCurrentHighlight(); // Implement this method in your ThemeService
  // }
}
