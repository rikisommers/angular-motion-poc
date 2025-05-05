import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { themes } from '../utils/theme';
// Define interfaces for different control types
interface BaseControlParams {
  label: string;
}

interface NumberControlParams extends BaseControlParams {
  min: number;
  max: number;
  step: number;
}

interface ColorControlParams extends BaseControlParams {
  view: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private themeData: Record<string, any>;
  private theme: any;

  // Create a BehaviorSubject to hold the current theme data
  private themeSubject = new BehaviorSubject<any>({
    data: themes.light.data
  
  });

  // Expose the current theme as an observable
  currentTheme$: Observable<any> = this.themeSubject.asObservable();

  constructor(rendererFactory: RendererFactory2, @Inject(PLATFORM_ID) private platformId: Object) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.theme = themes.light.data;
    this.themeData = this.getInitialThemeData();
  }

  private getInitialThemeData() {
    return this.theme;
  }

  public updateTheme(newTheme: Record<string, any>) {
    console.log('Updating theme with:', newTheme); // Debugging line
    this.themeData = { ...this.themeData, ...newTheme };
    this.setBodyDataAttributes({ name: 'custom', data: this.themeData });
    this.themeSubject.next(this.themeData);
  }

  public updateThemeVariable(variable: string, value: any) {
    if (this.themeData) {
      console.log(`Updating theme variable: ${variable} = ${value}`);
      this.themeData[variable] = value;
      this.setBodyDataAttributes({ name: 'custom', data: this.themeData });
      
      // Log all CSS variables for debugging
      console.log('Current theme variables:', this.themeData);
      this.themeSubject.next(this.themeData);
    }
  }

  setBodyDataAttributes(theme: { name: string; data: Record<string, any> }) {
    if (isPlatformBrowser(this.platformId)) {
      // Create a proper CSS string with each variable on its own line
      const cssVariables = Object.entries(theme.data)
        .map(([key, value]) => `--${key}: ${value};`)
        .join('\n');

      // Apply to :root for better CSS cascade
      const styleElement = document.getElementById('theme-style') || document.createElement('style');
      styleElement.id = 'theme-style';
      styleElement.textContent = `:root {${cssVariables}}`;
      
      if (!styleElement.parentNode) {
        document.head.appendChild(styleElement);
      }
      
      // Also trigger change detection
      document.dispatchEvent(new CustomEvent('theme-updated'));
    }
  }

  public getThemeData(): Record<string, any> {
    return this.themeData || themes.light;
  }
}



// import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { themes } from '../utils/theme';
// import { BehaviorSubject } from 'rxjs';
// import { signal } from '@angular/core';

// // Define interfaces for different control types
// interface BaseControlParams {
//   label: string;
// }

// interface NumberControlParams extends BaseControlParams {
//   min: number;
//   max: number;
//   step: number;
// }

// interface ColorControlParams extends BaseControlParams {
//   view: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ThemeService {
//   private renderer: Renderer2;
//   private themeData: Record<string, any>;
//   private themeSubject = new BehaviorSubject<Record<string, any>>({});
  
//   // Observable that components can subscribe to for theme changes
//   public theme$ = this.themeSubject.asObservable();

//   // Create a signal to hold the current theme
//   private currentThemeSignal = signal<any>({ textAnimation: 'fade', textHighlight: 'blue' });

//   // Getter for the current theme signal
//   get currentTheme() {
//     return this.currentThemeSignal;
//   }

//   constructor(rendererFactory: RendererFactory2, @Inject(PLATFORM_ID) private platformId: Object) {
//     this.renderer = rendererFactory.createRenderer(null, null);
    
//     // Initialize with default theme
//     this.themeData = { ...themes.light.data };
    
//     // Apply initial theme
//     this.setBodyDataAttributes({ name: 'default', data: this.themeData });
    
//     // Publish initial theme
//     this.themeSubject.next(this.themeData);
    
//     // Try to load saved theme from localStorage
//     this.loadSavedTheme();
//   }

//   private loadSavedTheme() {
//     if (isPlatformBrowser(this.platformId)) {
//       try {
//         const savedTheme = localStorage.getItem('userTheme');
//         if (savedTheme) {
//           const parsedTheme = JSON.parse(savedTheme);
//           this.updateTheme(parsedTheme);
//         }
//       } catch (e) {
//         console.error('Error loading saved theme:', e);
//       }
//     }
//   }

//   public updateTheme(newTheme: Record<string, any>) {
//     // Merge new theme with existing theme data
//     this.themeData = { ...this.themeData, ...newTheme };
    
//     // Apply updated theme
//     this.setBodyDataAttributes({ name: 'custom', data: this.themeData });
    
//     // Save to localStorage for persistence
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.setItem('userTheme', JSON.stringify(this.themeData));
//     }
    
//     // Publish updated theme
//     this.themeSubject.next(this.themeData);

//     // Update the current theme signal
//     this.currentThemeSignal.set(newTheme);
//   }

//   public updateThemeVariable(variable: string, value: any) {
//     if (this.themeData) {
//       // Update only the specified variable in the existing theme data
//       this.themeData[variable] = value;
      
//       // Apply updated theme
//       this.setBodyDataAttributes({ name: 'custom', data: this.themeData });
      
//       // Save to localStorage for persistence
//       if (isPlatformBrowser(this.platformId)) {
//         localStorage.setItem('userTheme', JSON.stringify(this.themeData));
//       }
      
//       // Publish updated theme
//       this.themeSubject.next(this.themeData);

//       // Update the current theme signal
//       this.currentThemeSignal.set(this.themeData);
//     }
//   }

//   setBodyDataAttributes(theme: { name: string; data: Record<string, any> }) {
//     if (isPlatformBrowser(this.platformId)) {
//       // Create a proper CSS string with each variable on its own line
//       const cssVariables = Object.entries(theme.data)
//         .map(([key, value]) => `--${key}: ${value};`)
//         .join('\n');

//       // Apply to :root for better CSS cascade
//       const styleElement = document.getElementById('theme-style') || document.createElement('style');
//       styleElement.id = 'theme-style';
//       styleElement.textContent = `:root {${cssVariables}}`;
      
//       if (!styleElement.parentNode) {
//         document.head.appendChild(styleElement);
//       }
      
//       // Also trigger change detection
//       document.dispatchEvent(new CustomEvent('theme-updated'));
//     }
//   }

//   public getThemeData(): Record<string, any> {
//     return { ...this.themeData }; // Return a copy to prevent direct mutation
//   }
  
//   public resetToDefault() {
//     this.themeData = { ...themes.light.data };
//     this.setBodyDataAttributes({ name: 'default', data: this.themeData });
    
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.removeItem('userTheme');
//     }
    
//     this.themeSubject.next(this.themeData);

//     // Reset the current theme signal
//     this.currentThemeSignal.set({ textAnimation: 'fade', textHighlight: 'blue' });
//   }
// }
