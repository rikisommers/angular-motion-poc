import { Component, Input, Output, EventEmitter, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';

export type DialogRole = 'dialog' | 'alertdialog';

/**
 * @category Overlays
 * @description A modal dialog component for displaying content that requires user interaction or attention. Features backdrop click handling, escape key support, and programmatic open/close control.
 */
@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements AfterViewInit {
  @ViewChild('dialogElement', { static: true }) dialogElement!: ElementRef<HTMLDialogElement>;

  /**
   * ID of the dialog element (used to open and close the modal)
   */
  @Input() dialog_id!: string;

  /**
   * Role of the dialog element. Can be either 'dialog' or 'alertdialog'
   */
  @Input() role: DialogRole = 'dialog';

  /**
   * Internal state to track if dialog is open
   */
  isOpen: boolean = false;

  @Output() dialogStateChange = new EventEmitter<boolean>();

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Ensure the dialog is properly initialized
    if (this.dialogElement?.nativeElement) {
      this.dialogElement.nativeElement.addEventListener('close', this.handleDialogClose);
    }
  }

  /**
   * Opens the dialog modal
   * @returns Promise that resolves when the dialog is opened
   */
  async openDialog(): Promise<void> {
    const dialog = this.dialogElement?.nativeElement;
    if (dialog && !this.isOpen) {
      dialog.showModal();
      this.isOpen = true;
      this.dialogStateChange.emit(this.isOpen);
    }
  }

  /**
   * Closes the dialog modal
   * @returns Promise that resolves when the dialog is closed
   */
  async closeDialog(): Promise<void> {
    const dialog = this.dialogElement?.nativeElement;
    if (dialog && this.isOpen) {
      dialog.close();
      this.isOpen = false;
      dialog.removeAttribute('open');
      this.dialogStateChange.emit(this.isOpen);
    }
  }

  private handleDialogClose = (event: Event) => {
    event.preventDefault();
    if (this.isOpen) {
      this.closeDialog();
    }
  };

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isOpen) {
      event.preventDefault();
      this.closeDialog();
    }
  }

  handleBackdropClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target === this.dialogElement?.nativeElement) {
      this.closeDialog();
    }
  }
}