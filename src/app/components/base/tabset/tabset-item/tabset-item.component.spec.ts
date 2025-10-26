import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsetItemComponent } from './tabset-item.component';

describe('TabsetItemComponent', () => {
  let component: TabsetItemComponent;
  let fixture: ComponentFixture<TabsetItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsetItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
