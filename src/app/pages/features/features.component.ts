import { Component } from '@angular/core';
import { PostIntroComponent } from '../../components/post/post-intro/post-intro.component';
import { BlockTileMonksComponent } from '../../components/base/tile/block-tile-monks/block-tile-monks.component';
@Component({
  selector: 'app-features',
  imports: [PostIntroComponent, BlockTileMonksComponent],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {

}
