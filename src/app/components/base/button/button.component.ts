import { Component, Input, Output, EventEmitter, ElementRef, HostListener, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonType =
  | 'primary'
  | 'primaryOutline'
  | 'primaryText'
  | 'secondary'
  | 'secondaryOutline'
  | 'secondaryText'
  | 'destructive'
  | 'destructiveOutline'
  | 'destructiveText';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type SpinnerType = 'default' | 'secondary' | 'error';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent implements OnChanges {
  @Input() submit: boolean = false;
  @Input() type: ButtonType = 'primary';
  @Input() size: ButtonSize = 'lg';
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() in_progress: boolean = false;
  @Input() spinner_delay_ms: number = 1000;

  @Output() awClick = new EventEmitter<Event>();

  canHideSpinner = true;

  private readonly spinnerColourPerType = {
    primary: 'default' as SpinnerType,
    primaryOutline: 'secondary' as SpinnerType,
    primaryText: 'secondary' as SpinnerType,
    secondary: 'secondary' as SpinnerType,
    secondaryOutline: 'secondary' as SpinnerType,
    secondaryText: 'secondary' as SpinnerType,
    destructive: 'default' as SpinnerType,
    destructiveOutline: 'error' as SpinnerType,
    destructiveText: 'error' as SpinnerType,
  };

  constructor(private el: ElementRef) {}

  get spinnerColour(): SpinnerType {
    return this.spinnerColourPerType[this.type];
  }

  ngOnChanges() {
    this.setSpinner();
  }

  private hideSpinnerIfAfterMinimumDisplayPeriod(): void {
    if (this.in_progress && this.canHideSpinner) {
      this.in_progress = false;
    }
  }

  private setSpinner(): void {
    if (this.in_progress) {
      this.canHideSpinner = false;
      setTimeout(() => {
        this.canHideSpinner = true;
        this.hideSpinnerIfAfterMinimumDisplayPeriod();
      }, this.spinner_delay_ms);
    } else {
      this.hideSpinnerIfAfterMinimumDisplayPeriod();
    }
  }

  handleClick(event: Event): void {
    if (this.disabled) return;

    this.awClick.emit(event);
    if (this.submit) {
      const form = this.el.nativeElement.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.awClick.emit(event);
      if (this.submit) {
        const form = this.el.nativeElement.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
    }
  }
}
