import { Component } from '@angular/core';
import { BlockHeroComponent } from '../components/blocks/block-hero/block-hero.component';
@Component({
  selector: 'app-blog',
  imports: [BlockHeroComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {

}
