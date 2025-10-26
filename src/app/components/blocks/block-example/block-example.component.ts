import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../base/button/button.component';
import { TabsetComponent, Tab } from '../../base/tabset/tabset.component';
import { TabsetItemComponent } from '../../base/tabset/tabset-item/tabset-item.component';
import { TabContentComponent } from '../../base/tabset/tab-content/tab-content.component';
import { DialogComponent } from '../../base/dialog/dialog.component';

@Component({
  selector: 'block-example',
  imports: [ CommonModule, ButtonComponent, TabsetComponent, TabsetItemComponent, TabContentComponent, DialogComponent],
  standalone:true,
  templateUrl: './block-example.component.html',
  styleUrl: './block-example.component.scss'
})
export class BlockExampleComponent {
  @ViewChild('exampleDialog') exampleDialog!: DialogComponent;

  @Input() title?: string;
  @Input() description?: string;
  @Input() code?: TemplateRef<any>;
  @Input() content?: TemplateRef<any>;
  @Input() onRetrigger?: () => void;

  tabs: Tab[] = [
    { id: 'content', title: 'Preview' },
    { id: 'code', title: 'Code' }
  ];

  activeTab = 'content';

  handleTabChange(tabId: string) {
    this.activeTab = tabId;
  }


  async toggleDialog(): Promise<void> {
    if (this.exampleDialog.isOpen) {
      await this.exampleDialog.closeDialog();
    } else {
      await this.exampleDialog.openDialog();
    }
  }
}
