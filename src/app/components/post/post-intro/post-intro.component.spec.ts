import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostIntroComponent } from './post-intro.component';

describe('PostIntroComponent', () => {
  let component: PostIntroComponent;
  let fixture: ComponentFixture<PostIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostIntroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
