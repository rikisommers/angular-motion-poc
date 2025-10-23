import { Component } from '@angular/core';
import { PageTransitionComponent } from '../../components/transition/page-transition/page-transition.component';
import { LogoComponent } from "../../components/motion/logo/logo.component";
import { BlockHeroComponent } from '../../components/blocks/block-hero/block-hero.component';
@Component({
  selector: 'app-work',
  imports: [PageTransitionComponent, LogoComponent, BlockHeroComponent],
  standalone:true,
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss'
})
export class WorkComponent {

}
