import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { themes } from './utils/theme';
import { ModalComponent } from "./components/base/modal/modal.component";
import { NavbarComponent } from "./components/navigation/navbar.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  showNavbar = true;

  constructor(private themeService: ThemeService, private router: Router) {}

  ngOnInit() {
    this.setTheme('light');
    // Set initial state
    this.updateNavbarVisibility(this.router.url);
    // Update on navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavbarVisibility(event.urlAfterRedirects || event.url);
      }
    });
  }

  setTheme(themeKey: string) {
    const theme = themes.akc12;
    if (theme) {
      this.themeService.updateTheme(theme.data);
    } else {
      console.error(`Theme not found: ${themeKey}`);
    }
  }

  openModal() {
    this.modalComponent.openModal();
  }

  test(){
    console.log('test');
  }
  onModalStateChange(isOpen: boolean) {
    console.log(`Modal is now ${isOpen ? 'open' : 'closed'}`);
  }

  private updateNavbarVisibility(url: string) {
    // Hide when navigating to a child route under /examples (e.g., /examples/basic)
    const isExamplesChild = /^\/examples\/.+/.test(url);
    this.showNavbar = !isExamplesChild;
  }
}
