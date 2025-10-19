import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-navbar-awwwards',
  templateUrl: './navbar-awwwards.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, MotionOneDirective]
})
export class NavbarAwwwardsComponent {
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

  // Motion variants for the indicator
  indicatorVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  constructor(private router: Router) {}

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
