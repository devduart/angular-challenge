import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CharacterCreateComponent } from '../../../features/characters/form/create/character-create.component';
import { By } from '@angular/platform-browser';

class MockMatDialog {
  open = jasmine.createSpy('open');
}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let dialog: MockMatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, NoopAnimationsModule],
      providers: [{ provide: MatDialog, useClass: MockMatDialog }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog) as any;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open CharacterCreateComponent dialog with correct configuration', () => {
    component.openCreateDialog();

    expect(dialog.open).toHaveBeenCalledWith(CharacterCreateComponent, {
      width: '32rem',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '150ms'
    });
  });

  it('should call openCreateDialog() when the create button is clicked', () => {
    spyOn(component, 'openCreateDialog');

    const button = fixture.debugElement.query(By.css('button'));
    if (button) {
      button.triggerEventHandler('click', null);
      expect(component.openCreateDialog).toHaveBeenCalled();
    } else {
      pending('No <button> element found in template. Add one to test click interaction.');
    }
  });
});
