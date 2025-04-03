import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone:true,
  styleUrl:'./modal.component.scss',
  template: `
    <dialog #modalDialog [open]="isOpen" class="relative flex flex-col h-vh100]">
      <button class="p-8 bg-red-500 close" (click)="onClose()">X</button>
      <div class="modal-content">
        <ng-content></ng-content>
      </div>
    </dialog>
  `,
  
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Output() modalStateChange = new EventEmitter<boolean>(); // Emit modal state changes

  ngOnInit() {
    if (this.isOpen) {
    //  document.body.classList.add('modal-open'); // Add a class to the body when modal is open
    }
  }

  ngOnDestroy() {
   // document.body.classList.remove('modal-open'); // Clean up on destroy
  }

  onClose() {
    this.isOpen = false; // Close the modal
    this.modalStateChange.emit(this.isOpen); // Notify parent component
  }

  openModal() {
    this.isOpen = true; // Open the modal
    this.modalStateChange.emit(this.isOpen); // Notify parent component
  }
}
