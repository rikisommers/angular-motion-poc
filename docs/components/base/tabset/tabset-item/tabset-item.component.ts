import { Component, Input, HostListener, ElementRef } from '@angular/core';

export type Layout = 'vertical' | 'horizontal';

@Component({
  selector: 'app-tabset-item',
  imports: [],
  standalone: true,
  templateUrl: './tabset-item.component.html',
  styleUrl: './tabset-item.component.scss'
})
export class TabsetItemComponent {
  @Input() tab_id: string = '';
  @Input() tab_title: string = '';
  @Input() layout: Layout = 'horizontal';
  @Input() is_active: boolean = false;

  constructor(private el: ElementRef) {}

  get classname(): string {
    const baseClasses = 'group/tab text-button relative box-border flex cursor-pointer items-center justify-center gap-4 overflow-hidden rounded-md border border-solid border-transparent font-medium capitalize duration-150 ease-in-out outline-none focus:outline-none';

    const layoutClasses = {
      horizontal: 'inline-block',
      vertical: 'flex'
    };

    const activeClasses = this.is_active
      ? 'z-index-20 text-blue-600'
      : 'text-gray-600';

    const compoundClasses = this.layout === 'vertical' && this.is_active
      ? 'bg-blue-50'
      : '';

    return `${baseClasses} ${layoutClasses[this.layout]} ${activeClasses} ${compoundClasses}`.trim();
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.el.nativeElement.click();
    }
  }
}
