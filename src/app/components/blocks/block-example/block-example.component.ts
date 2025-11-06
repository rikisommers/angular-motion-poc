import { Component, Input, TemplateRef, ViewChild, AfterViewChecked, ElementRef, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges, ContentChild, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../base/button/button.component';
import { DialogComponent } from '../../base/dialog/dialog.component';
import { BlockCodeComponent } from '../block-code/block-code.component';

@Component({
  selector: 'block-example',
  imports: [ CommonModule, RouterLink, ButtonComponent, DialogComponent, BlockCodeComponent],
  standalone:true,
  templateUrl: './block-example.component.html',
  styleUrl: './block-example.component.scss'
})
export class BlockExampleComponent implements OnInit {
  @ViewChild('exampleDialog') exampleDialog!: DialogComponent;

  @Input() title?: string;
  @Input() description?: string;
  @Input() codeString?: string;
  @Input() language: string = 'html';
  @Input() layout: 'inline' | 'dialog' = 'dialog';
  @Input() content?: TemplateRef<any>;
  @Input() onRetrigger?: () => void;
  @Input() showBreadcrumbs: boolean = false;
  @Input() exampleTitle?: string;
  @Input() prevExample?: { path: string; title: string };
  @Input() nextExample?: { path: string; title: string };

  constructor() {}

  ngOnInit(): void {
  }

  async toggleDialog(): Promise<void> {
    if (this.exampleDialog.isOpen) {
      await this.exampleDialog.closeDialog();
    } else {
      await this.exampleDialog.openDialog();
    }
  }
}
