import { Component, Input, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { themes } from '../../../../../utils/theme';
import { processItalicText, isItalic } from "../text-formatting.util";
import { ThemeService } from '../../../../../services/theme.service';
import { textHighlightThemes } from '../../../../../utils/theme';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-highlighted-segment',
  standalone: true,

  template: `
    <span 
      class="inline-flex px-4 py-0 rounded-xl" 
      [attr.style]="styleString" 
      [innerHTML]="hasItalic ? processedSegment : segment">
     {{highlight}}
    </span>`
})
export class HighlightedSegment implements OnInit {
  @Input() segment?: string;
  @Input() highlight?: string;
  
  processedSegment: string = '';
  hasItalic: boolean = false;
  styleString: string = '';
  currentTheme: any;

  constructor(private themeService: ThemeService) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.getThemeData();

    if (this.segment) {
      this.hasItalic = isItalic(this.segment);
      const result = processItalicText(this.segment);
      this.processedSegment = result.processed;
    }
    
    // Get colors from theme
    const surface1 = this.currentTheme?.data?.surface1;
    const surface2 = this.currentTheme?.data?.surface2;
    const gradientAngle = this.currentTheme?.data?.heroCssGradientAngle || '145deg';

    // Set the styleString based on the highlight type
    this.styleString = this.getStyleString(surface1, surface2, gradientAngle, this.currentTheme);
  }

  getStyleString(surface1: string, surface2: string, gradientAngle: string, currentTheme: any): string {
    // Ensure currentTheme is defined before using it
    if (!currentTheme) {
      return ''; // Return an empty string if theme is not available
    }

    const styleMap = {
      'text': 'color: var(--textAccent);',
      'background': 'background-color: var(--accentPri);',
      'underline': 'text-decoration: underline; text-decoration-color: var(--accentPri);',
      'highlight': 'background-color: var(--accentPri)!important; filter: blur(20px);',
      'figma': 'background-color: var(--surface1);',
      'figma-neumorphic': `background: linear-gradient(${gradientAngle}, var(--surface1), var(--surface2)); position: relative; box-shadow: 7px 7px 14px var(--bodyBackgroundColor), -7px -7px 14px var(--textColorInv));`,
      'default': 'background-color: var(--surface1);'
    };

    return styleMap['figma']

  }
}
