import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private clickSound: HTMLAudioElement;

  constructor() {
    this.clickSound = new Audio('/assets/sounds/click.mp3');
  }

  playClick(): void {
    this.clickSound.currentTime = 0;
    this.clickSound.play().catch(error => {
      console.warn('Error playing click sound:', error);
    });
  }
} 