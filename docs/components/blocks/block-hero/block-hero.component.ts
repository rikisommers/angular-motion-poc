import { Component, Input, OnInit } from '@angular/core';
import { themes } from '../../../utils/theme';
import { BackgroundComponent } from '../../background/background/background.component';
import { PostIntroComponent } from '../../post/post-intro/post-intro.component';

@Component({
  selector: 'app-block-hero',
  imports:[BackgroundComponent, PostIntroComponent],
  standalone:true,
  template: `
      <div [class]="getHeightClass(currentTheme.data.heroHeight)" 
           class="relative flex flex-col items-start justify-end left-0 top-0 z-50 w-full h-full gap-8 px-16 py-16">
          <app-background></app-background>
          <app-post-intro [title]="title" [content]="content" [tag]="tag"></app-post-intro>
      </div>
  `,
})
export class BlockHeroComponent implements OnInit {
  @Input() title?: string;
  @Input() content?: string;
  @Input() tag?: string;
  @Input() image: any; // Define a proper type for image if possible
  currentTheme: any; // Define a proper type for currentTheme


  ngOnInit() {
    this.currentTheme = themes.light;
  }

  getHeightClass(height: string): string {
    switch (height) {
      case 'full':
        return 'h-screen';
      case 'half':
        return 'min-h-[50vh]';
      case 'auto':
        return 'min-h-fit';
      default:
        return 'h-screen';
    }
  }
}
