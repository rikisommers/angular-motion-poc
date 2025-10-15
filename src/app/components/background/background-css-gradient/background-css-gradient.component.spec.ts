import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundCssGradientComponent } from './background-css-gradient.component';

describe('BackgroundCssGradientComponent', () => {
  let component: BackgroundCssGradientComponent;
  let fixture: ComponentFixture<BackgroundCssGradientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundCssGradientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundCssGradientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
