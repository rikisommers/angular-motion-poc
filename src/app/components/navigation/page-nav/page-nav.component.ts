import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { MotionOneDirective } from 'ngx-motion';

export interface NavItem {
  id: string;
  title: string;
  href?: string;
}

@Component({
  selector: 'app-page-nav',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, MotionOneDirective],
  templateUrl: './page-nav.component.html',
  styleUrl: './page-nav.component.scss'
})
export class PageNavComponent implements OnInit, OnDestroy {
  @Input() content: NavItem[] = [];

  isMenuActive = false;
  activeItem = '';
  isOpen = false;

  private observer?: IntersectionObserver;

  // Animation variants based on the React component
  subMenuAnimate = {
    animate: {
      opacity: 1,
      scale: 1,
      display: 'block',
      transition: {
        type: 'spring',
        stiffness: 100,
        staggerChildren: 0.05
      }
    },
    initial: {
      opacity: 0.9,
      scale: 0.9,
      transitionEnd: {
        display: 'none'
      }
    }
  };

  childVariants = {
    animate: {
      opacity: 1
    },
    initial: {
      opacity: 0.2
    },
    transition: {
      duration: 0.3,
      ease: [0.33, 1, 0.68, 1]
    }
  };

  indicatorAnimate = {
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        staggerChildren: 0.05
      }
    },
    initial: {
      opacity: 0.9,
      scale: 0.9
    }
  };

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeItem = entry.target.id;
        }
      });
    });

    // Observe each section
    this.content.forEach((item) => {
      const section = document.getElementById(item.title);
      if (section) {
        this.observer?.observe(section);
      }
    });
  }

  handleMouseEnter() {
    this.isOpen = true;
  }

  handleMouseLeave() {
    this.isOpen = false;
  }

  handleMenuMouseEnter() {
    if (!this.isOpen) {
      this.isOpen = true;
    }
  }

  handleMenuMouseLeave() {
    if (this.isOpen) {
      this.isOpen = false;
    }
  }

  onNavClick(event: Event, item: NavItem) {
    event.preventDefault();
    const href = item.href || `#${item.title}`;
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      history.pushState(null, '', href);
    }
  }
}
