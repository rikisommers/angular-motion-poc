import {Component, Input} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PostImage} from '../block-tile-monks/block-tile-monks.component';


@Component({
  selector: 'app-tile',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss'
})
export class TileComponent {

  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() tags?: string[];
  @Input() image?: string;
  @Input() aspect?: 'square' | 'video';
  @Input() route?: string;


}
