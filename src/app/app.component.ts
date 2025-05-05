import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { MotionOneDirective } from './directives/motion-one.directive';
import { ThemeService } from './services/theme.service';
import { themes } from './utils/theme';
import { ThemeEditorComponent } from './components/theme-editor/theme-editor.component';
import { ModalComponent } from "./components/base/modal/modal.component";
import { LogoComponent } from "./components/motion/logo/logo.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ThemeEditorComponent, ModalComponent, LogoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.setTheme('light');
  }

  setTheme(themeKey: string) {
    const theme = themes.akc12;
    if (theme) {
      this.themeService.setBodyDataAttributes(theme);
    } else {
      console.error(`Theme not found: ${themeKey}`);
    }
  }

  openModal() {
    this.modalComponent.openModal();
  }

  onModalStateChange(isOpen: boolean) {
    console.log(`Modal is now ${isOpen ? 'open' : 'closed'}`);
  }
}
