import { Component, OnInit } from '@angular/core';
import { themes } from '../../../utils/theme';
@Component({
  selector: 'app-background-css-grad',
  template: `
  <h1 class="absolute z-50 top-8 left-8">
    CSS gradient</h1>
    <div class="absolute top-0 left-0 w-full h-full"
          [style]="backgroundStyle"
          >
    </div>
  `,
})
export class BackgroundCssGradComponent implements OnInit {
  currentTheme: any; // Define a proper type for currentTheme
  backgroundStyle: any;


  ngOnInit() {
    this.currentTheme = themes.light;
    this.setBackgroundStyle();
  }
  

  setBackgroundStyle() {
    const gradientType = this.currentTheme.data.heroCssGradient;
    const angle = this.currentTheme.data.heroCssGradientAngle || 45;
    const gradientAngle = `${angle}deg`;

    switch (gradientType) {
      case 'linear':
        this.backgroundStyle = {
          background: `linear-gradient(${gradientAngle}, ${this.currentTheme.data.gradStart}, ${this.currentTheme.data.gradStop})`,
        };
        break;

      case 'radial':
        this.backgroundStyle = {
          background: `radial-gradient(circle, ${this.currentTheme.data.gradStart}, ${this.currentTheme.data.gradStop})`,
        };
        break;

      case 'conic':
        this.backgroundStyle = {
          background: `conic-gradient(from ${gradientAngle}, ${this.currentTheme.data.gradStart}, ${this.currentTheme.data.gradStop})`,
        };
        break;

      default:
        this.backgroundStyle = {
          background: `linear-gradient(${gradientAngle}, ${this.currentTheme.data.gradStart}, ${this.currentTheme.data.gradStop})`,
        };
    }
  }
}