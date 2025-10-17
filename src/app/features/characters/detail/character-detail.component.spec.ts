import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterDetailComponent } from './character-detail.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Observable } from 'rxjs';
import { Character } from '../../../core/models/character.model';
import { createCharactersStore } from '../state/characters.store';

class MockDialogRef {
  close = jasmine.createSpy('close');
  updateSize = jasmine.createSpy('updateSize');
}

class MockDialog {
  private _afterClosed$: Observable<any> = of(null);
  openCalls: any[] = [];

  setAfterClosedReturn(value: any) {
    this._afterClosed$ = of(value);
  }

  open(_component: any, config: any) {
    this.openCalls.push({ _component, config });
    return { afterClosed: () => this._afterClosed$ };
  }
}

describe('CharacterDetailComponent', () => {
  let fixture: ComponentFixture<CharacterDetailComponent>;
  let component: CharacterDetailComponent;
  let dialogRef: MockDialogRef;
  let dialog: MockDialog;
  let mockStore: Partial<ReturnType<typeof createCharactersStore>>;

  const mockCharacter: Character = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    image: 'rick.jpg',
  };

  beforeEach(async () => {
    dialogRef = new MockDialogRef();
    dialog = new MockDialog();

    mockStore = {
      update: jasmine.createSpy('update'),
      remove: jasmine.createSpy('remove'),
      characters: jasmine.createSpyObj('charactersSignal', ['set', 'update']),
    };

    await TestBed.configureTestingModule({
      imports: [
        CharacterDetailComponent,
        NoopAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { character: mockCharacter } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterDetailComponent);
    component = fixture.componentInstance;

    component.store = mockStore as ReturnType<typeof createCharactersStore>;

    (component as any).dialog = dialog;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with updated=false when unchanged', () => {
    component.close();
    expect(dialogRef.close).toHaveBeenCalledWith({ updated: false });
  });

  it('should close dialog with updated=true when character was edited', () => {
    component.character.set({ ...mockCharacter, name: 'Updated Rick' });
    component.close();
    expect(dialogRef.close).toHaveBeenCalledWith({ updated: true });
  });

  it('should open edit dialog and update character when closed with data', () => {
    const updated = { ...mockCharacter, name: 'Edited Rick' };
    dialog.setAfterClosedReturn(updated);

    component.edit();

    expect(dialog.openCalls.length).toBe(1);
    expect(mockStore.update).toHaveBeenCalledWith(updated);
    expect(dialogRef.updateSize).toHaveBeenCalled();
    expect(component.character()).toEqual(updated);
  });

  it('should not update when edit dialog returns null', () => {
    dialog.setAfterClosedReturn(null);

    component.edit();

    expect(dialog.openCalls.length).toBe(1);
    expect(mockStore.update).not.toHaveBeenCalled();
    expect(dialogRef.updateSize).not.toHaveBeenCalled();
  });

  it('should delete character when confirmed', async () => {
    spyOn(window, 'confirm').and.returnValue(true);

    await component.delete();

    expect(mockStore.remove).toHaveBeenCalledWith(mockCharacter.id);
    expect(dialogRef.close).toHaveBeenCalledWith({ deleted: true });
  });

  it('should not delete character when user cancels', async () => {
    spyOn(window, 'confirm').and.returnValue(false);

    await component.delete();

    expect(mockStore.remove).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalledWith({ deleted: true });
  });
});
