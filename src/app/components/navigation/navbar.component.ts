import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AudioService } from '../../services/audio.service';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarAwwwardsComponent } from './variants/navbar-awwwards.component';
import { NavbarApplauseComponent } from './variants/navbar-applause.component';
import { routes } from '../../app.routes';
import { Route } from '@angular/router';

interface Page {
  id: string;
  title: string;
  icon: string;
  url: string;
  slug: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarAwwwardsComponent,
    NavbarApplauseComponent,
    NgOptimizedImage
  ]
})
export class NavbarComponent implements OnInit {

  @ViewChild('menuRef') menuRef!: ElementRef;
  @ViewChild('menuDragRef') menuDragRef!: ElementRef;

  pages: Page[] = [];
  activePage: string = '';
  isActive = false;
  offset = 0;
  edges = {
    left: false,
    right: false,
    top: false,
    bottom: false
  };
  orientation = '';

  constructor(
    public themeService: ThemeService,
    private audioService: AudioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializePages();
    console.log(this.pages);
  }

  private initializePages(): void {
    this.pages = routes
      .filter((route: Route) => route.path && route.path !== '**')
      .map((route: Route) => {
        const path = route.path || '';
        return {
          id: path,
          title: path.charAt(0).toUpperCase() + path.slice(1),
          icon: this.getIconForRoute(path),
          url: `/${path}`,
          slug: path
        };
      });

    this.activePage = this.pages.length > 0 ? this.pages[0].id : '';
  }

  private getIconForRoute(path: string): string {
    const iconMap: { [key: string]: string } = {
      '': 'home',
      'work': 'briefcase',
      'blog': 'book',
      'about': 'user',
      'contact': 'mail'
    };
    return iconMap[path] || 'circle';
  }

  private hexToRgba(hex: string, alpha: number): string {
    if (!hex) return '';

    hex = hex.replace(/^#/, '');
    let r: number, g: number, b: number;

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      throw new Error('Invalid HEX color format');
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  getNavigationStyle(navigationStyle: string): string {
    switch (navigationStyle) {
      case 'solid':
        return this.themeService.currentTheme.data.accentPri;
      case 'transparent':
        return this.themeService.currentTheme.data.navBg;
      default:
        return 'solid';
    }
  }

  getNavigationPositionClass(navigationPosition: string): string {
    switch (navigationPosition) {
      case 'topLeft':
        return '(col-start-2 col-span-1 row-span-1 row-start-1) w-fit';
      case 'topCenter':
        return 'col-start-3 col-span-1 row-span-1 row-start-1 w-fit mx-auto';
      case 'topRight':
        return 'col-start-4 col-span-1 row-span-1 row-start-1 w-fit';
      case 'bottomLeft':
        return 'col-start-1 col-span-1 row-span-1 row-start-5 w-fit';
      case 'bottomCenter':
        return 'col-start-3 col-span-1 row-span-1 row-start-5 w-fit mx-auto';
      case 'bottomRight':
        return 'col-start-3 col-span-1 row-span-1 row-start-5 w-fit';
      case 'leftCenter':
        return 'col-start-1 col-span-1 row-span-1 row-start-3 flex flex-col w-[40px] writing-mode-sideways-rl ml-4';
      case 'rightCenter':
        return 'col-start-5 col-span-1 row-span-1 row-start-3 flex flex-col w-[40px] writing-mode-sideways-rl mr-4';
      default:
        return 'col-start-2 col-span-1 row-span-1 row-start-1';
    }
  }

  handleNavClick(pageId: string): void {
    this.audioService.playClick();
    this.activePage = pageId;
  }

  renderNavigation(theme: string): string {
    switch (theme) {
      case 'awwwards':
        return 'app-navbar-awwwards';
      case 'applause':
        return 'app-navbar-applause';
      default:
        return 'app-navbar-awwwards';
    }
  }
}
