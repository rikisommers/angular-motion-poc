import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextLineUpComponent } from './text-line-up.component';

describe('TextLineUpComponent', () => {
  let component: TextLineUpComponent;
  let fixture: ComponentFixture<TextLineUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextLineUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextLineUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
