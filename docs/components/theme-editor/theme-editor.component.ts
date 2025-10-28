import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { NgFor } from '@angular/common';
import { textAnimationThemes, textHighlightThemes, heroBackgroundThemes, heroCssGradientThemes, heroCssGradientRadialPositionThemes} from '../../utils/theme';

@Component({
  selector: 'app-theme-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theme-editor.component.html',
  styleUrls: ['./theme-editor.component.scss'],
})
export class ThemeEditorComponent implements OnInit {
  themeData: any = {};
  colorKeys: string[] = [];
  
  // Convert objects to arrays of keys
  textHighlightOptions: string[] = Object.keys(textHighlightThemes);
  texAnmationOptions: string[] = Object.keys(textAnimationThemes);
  textAnimationSecOptions: string[] = Object.keys(textAnimationThemes);
  heroBackgroundOptions: string[] = Object.keys(heroBackgroundThemes);

  heroCSSGradientOptions: string[] = Object.keys(heroCssGradientThemes);
  heroCSSGradientRadialPositionOptions: string[] = Object.keys(heroCssGradientRadialPositionThemes);

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeData = this.themeService.currentTheme;
    this.colorKeys = Object.keys(this.themeData || {});
  }

  updateTheme(property: string, value: any) {
    this.themeService.updateTheme({ [property]: value });
  }
}