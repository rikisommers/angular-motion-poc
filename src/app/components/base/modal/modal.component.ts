import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone:true,
  template: `
    <dialog #modalDialog [open]="isOpen" class="relative flex flex-col">
      <button class="p-8 bg-red-500 close" (click)="onClose()">X</button>
      <div class="modal-content">
        <ng-content></ng-content>
      </div>
    </dialog>
  `,
  styles: [`
    dialog {
      background-color: beige;
      border: 2px solid burlywood;
      
      border-radius: 5px;
      padding: 20px;
      width: 300px; /* Adjust width as needed */
      max-width: 90%; /* Responsive width */
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    .close {
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      position: absolute;
      z-index:9999;
      top: 10px;
      right: 10px;
    }
    
  `],
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
