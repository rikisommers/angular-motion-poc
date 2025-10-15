import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileTransitionComponent } from './tile-transition.component';

describe('TileTransitionComponent', () => {
  let component: TileTransitionComponent;
  let fixture: ComponentFixture<TileTransitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileTransitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
