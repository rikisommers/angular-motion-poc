import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts$ = new Subject<Toast>();
  private toastIdCounter = 0;

  get toasts() {
    return this.toasts$.asObservable();
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 3000): void {
    const toast: Toast = {
      id: `toast-${this.toastIdCounter++}`,
      message,
      type,
      duration
    };
    this.toasts$.next(toast);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }
}

