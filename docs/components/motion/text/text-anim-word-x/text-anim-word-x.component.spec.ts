import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAnimWordXComponent } from './text-anim-word-x.component';

describe('TextAnimWordXComponent', () => {
  let component: TextAnimWordXComponent;
  let fixture: ComponentFixture<TextAnimWordXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAnimWordXComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextAnimWordXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
