import { Component } from '@angular/core';
import { PostIntroComponent } from '../../components/post/post-intro/post-intro.component';
import { BlockTileMonksComponent } from '../../components/base/tile/block-tile-monks/block-tile-monks.component';
import { TileComponent } from '../../components/base/tile/tile/tile.component';
import { ButtonComponent } from '../../components/base/button/button.component';
import { TextAnimLineUpComponent } from '../../components/motion/text/text-anim-line-up/text-line-up.component';

@Component({
  selector: 'app-features',
  imports: [PostIntroComponent, BlockTileMonksComponent, TileComponent, ButtonComponent, TextAnimLineUpComponent],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {

}
