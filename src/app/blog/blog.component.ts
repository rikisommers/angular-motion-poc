import { Component } from '@angular/core';
import { BlockHeroComponent } from '../components/blocks/block-hero/block-hero.component';
import { LogoComponent } from "../components/motion/logo/logo.component";
@Component({
  selector: 'app-blog',
  imports: [BlockHeroComponent, LogoComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {

}
