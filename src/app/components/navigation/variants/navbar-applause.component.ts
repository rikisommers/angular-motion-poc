import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MotionOneDirective } from '../../../directives/motion-one.directive';

interface Page {
  id: string;
  title: string;
  icon: string;
  url: string;
}

interface Theme {
  data: {
    navStyle: string;
    navPosition: string;
    navLabelDisplay: string;
    accentPri: string;
  };
}

@Component({
  selector: 'app-navbar-applause',
  templateUrl: './navbar-applause.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, MotionOneDirective]
})
export class NavbarApplauseComponent {
  @Input() pages: Page[] = [];
  @Input() activePage: string = '';
  @Input() currentTheme: Theme = {
    data: {
      navStyle: 'solid',
      navPosition: 'topCenter',
      navLabelDisplay: 'text',
      accentPri: '#000000'
    }
  };
  @Output() navClick = new EventEmitter<string>();
  @ViewChild('containerRef') containerRef!: ElementRef;

  private mousePosition = { x: 0, y: 0 };
  private isMouseInContainer = false;
  private baseSize = 66;
  private maxSize = 90;
  private maxDistance = 200;
  private hoverStates: { [key: string]: number } = {};

  // Motion variants for the indicator
  indicatorVariants = {
    initial: {
      opacity: 0,
      scale: 0.4,
      y: -40
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -40
    }
  };

  constructor(private router: Router) {}

  handleContainerMouseMove(event: MouseEvent): void {
    if (!this.containerRef?.nativeElement) return;

    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    this.mousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    // Update hover states for all items
    this.pages.forEach(page => {
      const element = document.getElementById(`nav-item-${page.id}`);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        const elementCenterX = elementRect.left + elementRect.width / 2;
        const elementCenterY = elementRect.top + elementRect.height / 2;
        const distance = this.distancePoints(
          this.mousePosition.x + rect.left,
          this.mousePosition.y + rect.top,
          elementCenterX,
          elementCenterY
        );

        if (distance < this.maxDistance) {
          const scale = 1 - (distance / this.maxDistance);
          this.hoverStates[page.id] = this.baseSize + (this.maxSize - this.baseSize) * scale;
        } else {
          this.hoverStates[page.id] = this.baseSize;
        }
      }
    });
  }

  handleContainerMouseEnter(): void {
    this.isMouseInContainer = true;
  }

  handleContainerMouseLeave(): void {
    this.isMouseInContainer = false;
    // Reset all hover states
    this.pages.forEach(page => {
      this.hoverStates[page.id] = this.baseSize;
    });
  }

  getNavItemWidth(page: Page): number {
    if (!this.isMouseInContainer) {
      return this.baseSize;
    }
    return this.hoverStates[page.id] || this.baseSize;
  }

  private distancePoints(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
  }

  renderDynamicIcon(iconName: string, size: number = 20): string {
    // In Angular, we'll use a different approach for icons
    // This is a placeholder - you'll need to implement your icon system
    return iconName;
  }

  onNavClick(pageId: string): void {
    this.navClick.emit(pageId);
    this.router.navigate([`/${pageId}`]);
  }
}
