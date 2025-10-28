import { Component, OnInit } from '@angular/core';
import { BackgroundCssGradComponent } from '../../background/background-css-gradient/background-css-gradient.component';
import { ThemeService } from '../../../services/theme.service';


import { NgIf } from '@angular/common';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [BackgroundCssGradComponent, NgIf],
  template: `
    <div class="absolute top-0 left-0 flex items-center justify-end w-full h-full pointer-events-none z-1">
     <!-- <app-background-css-grad></app-background-css-grad> -->
<h1>{{currentTheme.heroBackground}}</h1>
    <!-- <ng-container *ngIf="currentTheme?.heroBackground === 'gradient'">
        <app-canvas-gradient></app-canvas-gradient>
      </ng-container> -->
      <ng-container *ngIf="currentTheme?.heroBackground === 'cssgradient'">
        <app-background-css-grad></app-background-css-grad>
      </ng-container>
      <!-- <ng-container *ngIf="currentTheme.heroBackgroundStyle === 'image' && image">
        <app-blend-image [src]="image.url" [alt]="'Cover Image for ' + image.title" class="absolute w-full h-full img-cover"></app-blend-image>
      </ng-container> -->
    </div>
  `,
})
export class BackgroundComponent implements OnInit {
  currentTheme: any; // Define a proper type for currentTheme
  image: any; // Define a proper type for image if possible


  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.currentTheme = this.themeService.currentTheme;
  }
}
