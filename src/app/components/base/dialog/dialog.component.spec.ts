import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.dialog_id = 'test-dialog';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close dialog', async () => {
    expect(component.isOpen).toBeFalsy();

    await component.openDialog();
    expect(component.isOpen).toBeTruthy();

    await component.closeDialog();
    expect(component.isOpen).toBeFalsy();
  });

  it('should emit dialog state changes', async () => {
    spyOn(component.dialogStateChange, 'emit');

    await component.openDialog();
    expect(component.dialogStateChange.emit).toHaveBeenCalledWith(true);

    await component.closeDialog();
    expect(component.dialogStateChange.emit).toHaveBeenCalledWith(false);
  });

  it('should close on escape key', () => {
    component.isOpen = true;
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    spyOn(component, 'closeDialog');

    component.handleKeyDown(event);
    expect(component.closeDialog).toHaveBeenCalled();
  });
});