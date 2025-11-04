import { Component, ViewChild, ViewChildren, QueryList, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BlockExampleComponent } from '../../components/blocks/block-example/block-example.component';
import { MotionOneDirective } from 'ngx-motion';
import { PageNavComponent, NavItem } from '../../components/navigation/page-nav/page-nav.component';
import { filter, map } from 'rxjs/operators';
import { TileComponent } from '../../components/base/tile/tile/tile.component';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-examples',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, BlockExampleComponent, MotionOneDirective, PageNavComponent, TileComponent],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.scss'
})
export class ExamplesComponent implements OnInit {
  @ViewChildren(MotionOneDirective) motionDirectives!: QueryList<MotionOneDirective>;

  breadcrumbs: Breadcrumb[] = [];
  isLandingPage = true;

  private routeLabels: { [key: string]: string } = {
    'basic': 'Basic Animation',
    'hover': 'Hover Effects',
    'text-animation': 'Text Animation'
  };

  // Navigation content array for page-nav component
  navigationContent: NavItem[] = [
    { id: 'hover', title: 'hover' },
    { id: 'focus', title: 'focus' },
    { id: 'tap', title: 'tap' },
    { id: 'variants', title: 'variants' },

    { id: 'easings', title: 'easings' },
    { id: 'repeat', title: 'repeat' },
    { id: 'delay', title: 'delay' },
    { id: 'timeline', title: 'timeline' },
    { id: 'whileInView', title: 'whileInView' },

    { id: 'staggerChildren', title: 'stagger children' },
  ];

    // Define variants for the interactive square
    squareVariants = {
      idle: { scale: 1, rotate: 0, backgroundColor: '#3b82f6' },
      hover: { scale: 2, rotate: 45, backgroundColor: '#ef4444' },
    };

    // Simple stagger animation data
    staggerWords = ['Staggered', 'text', 'animation', 'example'];

    // Delay animation items (4 items for the loop)
    delayItems = Array.from({ length: 16 }, (_, i) => i);

    // Make Infinity available in template
    Infinity = Infinity;

    // Animation trigger states
    animationTriggers: { [key: string]: boolean } = {
      variants: false,
      fadeScale: false,
      timeline: false,
      hover: false,
      repeat: false,
      stagger: true, // Start with stagger animation visible
      easings: false,
      inView: false,
      focus: false
    };

    // Retrigger animation - restart all motion directives
    retriggerAnimation(animationKey: string) {
      console.log('[Examples] Retriggering animations for:', animationKey);

      // Find and restart all motion directives
      if (this.motionDirectives) {
        this.motionDirectives.forEach((directive: MotionOneDirective) => {
          console.log('[Examples] Restarting directive:', directive.elementId);
          directive.restartAnimation();
        });
      }

      // Also force change detection as fallback
      this.animationTriggers = { ...this.animationTriggers };
    }

    // Handle inView trigger
    onInView(animationKey: string) {
      this.animationTriggers[animationKey] = true;
    }

    // Individual retrigger methods for each animation
    retriggerVariants = () => this.retriggerAnimation('variants');
    retriggerFadeScale = () => this.retriggerAnimation('fadeScale');
    retriggerTimeline = () => this.retriggerAnimation('timeline');
    retriggerHover = () => this.retriggerAnimation('hover');
    retriggerRepeat = () => this.retriggerAnimation('repeat');
    retriggerStagger = () => this.retriggerAnimation('stagger');
    retriggerEasings = () => this.retriggerAnimation('easings');
    retriggerInView = () => this.retriggerAnimation('inView');
    retriggerFocus = () => this.retriggerAnimation('focus');
    retriggerInViewOptions = () => this.retriggerAnimation('inViewOptions');

    constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
      this.updateBreadcrumbs();
      this.checkIfLandingPage();
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.updateBreadcrumbs();
          this.checkIfLandingPage();
        });
    }

    private checkIfLandingPage(): void {
      // Check if we're on the root /examples route
      this.isLandingPage = this.router.url === '/examples' || this.router.url === '/';
    }

    private updateBreadcrumbs(): void {
      this.breadcrumbs = [];
      
      // Always add the root "Examples" breadcrumb
      this.breadcrumbs.push({
        label: 'Examples',
        url: '/examples'
      });

      // Get the current child route segment
      let route = this.activatedRoute.firstChild;
      while (route?.firstChild) {
        route = route.firstChild;
      }

      if (route && route.snapshot.url && route.snapshot.url.length > 0) {
        const segment = route.snapshot.url[0].path;
        const label = this.routeLabels[segment] || this.formatLabel(segment);
        const url = `/examples/${segment}`;
        
        this.breadcrumbs.push({
          label: label,
          url: url
        });
      }
    }

    private formatLabel(segment: string): string {
      return segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // Handle navigation clicks with smooth scroll
    onNavClick(event: Event, href: string) {
      event.preventDefault();
      const container = document.getElementById('scrollContainer');
      const target = document.querySelector(href);
      if (container && target) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const scrollTop = container.scrollTop + targetRect.top - containerRect.top;

        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
        history.pushState(null, '', href);
      }
    }

}
