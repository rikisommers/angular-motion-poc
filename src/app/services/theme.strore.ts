// src/app/services/theme.store.ts
import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeStore {
  // Create a signal to hold the current theme
  private currentThemeSignal = signal<any>({});

  // Getter for the current theme signal
  get currentTheme() {
    return this.currentThemeSignal;
  }

  // Method to update the theme
  updateTheme(newTheme: any) {
    this.currentThemeSignal.set(newTheme);
  }
}