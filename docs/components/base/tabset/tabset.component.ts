import { Component, Input, Output, EventEmitter, ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsetItemComponent } from './tabset-item/tabset-item.component';

export interface Tab {
  id: string;
  title: string;
}

export type Layout = 'vertical' | 'horizontal';

@Component({
  selector: 'app-tabset',
  imports: [CommonModule, TabsetItemComponent],
  standalone: true,
  templateUrl: './tabset.component.html',
  styleUrl: './tabset.component.scss'
})
export class TabsetComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() tabs: Tab[] = [];
  @Input() layout: Layout = 'horizontal';
  @Input() hide_nav: boolean = false;
  @Input() active_tab?: string;

  @Output() atuiChange = new EventEmitter<string>();

  private _tabsetId = `tabset-${Math.random().toString(36).substring(2, 11)}`;
  private resizeObserver?: ResizeObserver;

  constructor(private el: ElementRef) {}

  get tabsetId(): string {
    return this._tabsetId;
  }

  ngOnInit() {
    if (this.tabs.length > 0 && !this.active_tab) {
      this.active_tab = this.tabs[0].id;
    }
  }

  ngAfterViewInit() {
    this.updateIndicatorPosition();

    // Setup resize observer to update indicator position on layout changes
    this.resizeObserver = new ResizeObserver(() => {
      this.updateIndicatorPosition();
    });

    const container = this.getContainerRef();
    if (container) {
      this.resizeObserver.observe(container);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private getIndicatorRef(): HTMLElement | null {
    return this.el.nativeElement.querySelector(`#indicator-${this._tabsetId}`);
  }

  private getContainerRef(): HTMLElement | null {
    return this.el.nativeElement.querySelector(`#container-${this._tabsetId}`);
  }

  handleTabChange(id: string): void {
    this.active_tab = id;
    this.handleActiveTabChange(id);
  }

  handleActiveTabChange(newValue: string) {
    const activeTab = this.tabs.find((tab) => tab.id === newValue);
    if (activeTab) {
      this.atuiChange.emit(activeTab.id);
      requestAnimationFrame(() => {
        this.updateIndicatorPosition();
      });
    }
  }

  getActiveTab(): string | undefined {
    return this.active_tab;
  }

  setActiveTab(value: string): void {
    this.active_tab = value;
    this.handleActiveTabChange(value);
  }

  private updateIndicatorPosition() {
    const indicatorRef = this.getIndicatorRef();
    const containerRef = this.getContainerRef();

    if (!indicatorRef || !containerRef) return;

    const activeTab = this.el.nativeElement.querySelector(`[data-tab-id="${this.active_tab}"][data-active="true"]`);

    if (activeTab) {
      const containerRect = containerRef.getBoundingClientRect();
      const buttonRect = activeTab.getBoundingClientRect();

      indicatorRef.style.width = `${buttonRect.width - 16}px`;
      indicatorRef.style.left = `${buttonRect.left - containerRect.left}px`;
      indicatorRef.style.opacity = '1';
    }
  }
}
