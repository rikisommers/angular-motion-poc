import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAnimNavigatorsComponent } from './text-anim-navigators.component';

describe('TextAnimNavigatorsComponent', () => {
  let component: TextAnimNavigatorsComponent;
  let fixture: ComponentFixture<TextAnimNavigatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAnimNavigatorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextAnimNavigatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
