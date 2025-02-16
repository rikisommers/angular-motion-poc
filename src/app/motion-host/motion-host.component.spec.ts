import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotionHostComponent } from './motion-host.component';

describe('MotionHostComponent', () => {
  let component: MotionHostComponent;
  let fixture: ComponentFixture<MotionHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotionHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotionHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
