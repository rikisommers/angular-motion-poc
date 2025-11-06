import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';
import { Subscription } from 'rxjs';
import { MotionOneDirective, MotionIfDirective } from 'ngx-motion';

@Component({
  selector: 'app-toast',
  imports: [CommonModule, MotionOneDirective, MotionIfDirective],
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  visibleToasts = new Set<string>();
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts.subscribe(toast => {
      this.toasts.push(toast);
      this.visibleToasts.add(toast.id);
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          this.removeToast(toast.id);
        }, toast.duration);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  removeToast(id: string): void {
    this.visibleToasts.delete(id);
    // Remove from array after animation completes
    setTimeout(() => {
      this.toasts = this.toasts.filter(toast => toast.id !== id);
    }, 300); // Match exit animation duration
  }

  isToastVisible(id: string): boolean {
    return this.visibleToasts.has(id);
  }

  getToastClass(type?: string): string {
    const baseClasses = 'flex items-center gap-8 px-16 py-12 rounded-lg shadow-lg transition-all duration-300 min-w-[200px] max-w-[400px]';
    const typeClasses = {
      success: 'bg-lime-600 text-white',
      error: 'bg-rose-600 text-white',
      info: 'bg-sky-600 text-white'
    };
    return `${baseClasses} ${typeClasses[type as keyof typeof typeClasses] || typeClasses.success}`;
  }
}

