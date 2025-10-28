import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasGradientComponent } from './canvas-gradient.component';

describe('CanvasGradientComponent', () => {
  let component: CanvasGradientComponent;
  let fixture: ComponentFixture<CanvasGradientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasGradientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasGradientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
