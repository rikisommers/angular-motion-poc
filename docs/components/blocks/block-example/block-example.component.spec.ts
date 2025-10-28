import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockExampleComponent } from './block-example.component';

describe('BlockExampleComponent', () => {
  let component: BlockExampleComponent;
  let fixture: ComponentFixture<BlockExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
