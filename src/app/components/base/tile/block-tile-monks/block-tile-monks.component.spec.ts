import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTileMonksComponent } from './block-tile-monks.component';

describe('BlockTileMonksComponent', () => {
  let component: BlockTileMonksComponent;
  let fixture: ComponentFixture<BlockTileMonksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockTileMonksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockTileMonksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


