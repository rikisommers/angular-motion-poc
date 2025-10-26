import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-content',
  standalone: true,
  template: `
    <div
      [class]="isActive ? 'flex flex-col' : 'hidden'"
      role="tabpanel"
      [id]="'panel-' + tab_id"
      [attr.aria-labelledby]="'tab-' + tab_id"
      [tabIndex]="isActive ? 0 : -1"
      [attr.aria-hidden]="!isActive">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class TabContentComponent {
  @Input() tab_id: string = '';
  @Input() is_active: boolean = false;

  get isActive(): boolean {
    return this.is_active;
  }
}