import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ThemeData {
  navStyle: string;
  navPosition: string;
  navLabelDisplay: string;
  navTheme: string;
  navFloating: boolean;
  navShadow: string | boolean;
  accentPri: string;
  navBg: string;
}

export interface Theme {
  data: ThemeData;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private defaultTheme: Theme = {
    data: {
      navStyle: 'solid',
      navPosition: 'topCenter',
      navLabelDisplay: 'text',
      navTheme: 'awwwards',
      navFloating: false,
      navShadow: 'rgba(0, 0, 0, 0.1)',
      accentPri: '#000000',
      navBg: 'transparent'
    }
  };

  private themeSubject = new BehaviorSubject<Theme>(this.defaultTheme);
  currentTheme$ = this.themeSubject.asObservable();

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  constructor() {}

  updateTheme(theme: Partial<ThemeData>): void {
    const currentTheme = this.currentTheme;
    this.themeSubject.next({
      data: {
        ...currentTheme.data,
        ...theme
      }
    });
  }
}
