import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CharacterEditComponent } from './character-edit.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CharactersService } from '../../../../core/services/characters.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { Character } from '../../../../core/models/character.model';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-character-form',
  template: '',
  standalone: true
})
class MockCharacterFormComponent {
  readonly initialData = signal<Character | null>(null);
  @Output() formSubmit = new EventEmitter<Character>();
}

class MockDialogRef {
  close = jasmine.createSpy('close');
}

class MockCharactersService {}

class MockNotificationService {
  info = jasmine.createSpy('info');
}

describe('CharacterEditComponent', () => {
  let fixture: ComponentFixture<CharacterEditComponent>;
  let component: CharacterEditComponent;
  let dialogRef: MockDialogRef;
  let notification: MockNotificationService;
  let mockStore: any;

  const mockCharacter: Character = {
    id: 101,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    image: 'https://example.com/rick.jpg'
  };

  beforeEach(async () => {
    mockStore = { update: jasmine.createSpy('update') };

    await TestBed.configureTestingModule({
      imports: [CharacterEditComponent, MockCharacterFormComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useClass: MockDialogRef },
        { provide: CharactersService, useClass: MockCharactersService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: MAT_DIALOG_DATA, useValue: { character: mockCharacter } },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterEditComponent);
    component = fixture.componentInstance;

    component.store = mockStore;

    dialogRef = TestBed.inject(MatDialogRef) as any;
    notification = TestBed.inject(NotificationService) as any;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the "character" signal with injected data', () => {
    expect(component.character()).toEqual(mockCharacter);
  });

  it('should initialize the "loading" signal as false', () => {
    expect(component.loading()).toBeFalse();
  });

  it('should set loading=true and then update character, notify, and close dialog after 500ms', fakeAsync(() => {
    const updatedCharacter = { ...mockCharacter, name: 'Updated Rick' };

    component.update(updatedCharacter);
    expect(component.loading()).toBeTrue();

    tick(500);

    expect(mockStore.update).toHaveBeenCalledWith(updatedCharacter);
    expect(notification.info).toHaveBeenCalledWith('Personagem Atualizado sucesso!');
    expect(dialogRef.close).toHaveBeenCalledWith(updatedCharacter);
    expect(component.loading()).toBeFalse();
  }));

  it('should call update() when form emits formSubmit', () => {
    const form = fixture.debugElement.nativeElement.querySelector('app-character-form');
    const spy = spyOn(component, 'update').and.callThrough();

    // cria um evento de submit manual
    const updatedCharacter = { ...mockCharacter, name: 'Morty' };
    (component as any).character.set(mockCharacter); // inicializa novamente
    const formComp = fixture.debugElement.children[0].componentInstance as MockCharacterFormComponent;
    formComp.formSubmit.emit(updatedCharacter);

    expect(spy).toHaveBeenCalledWith(updatedCharacter);
  });

  it('should toggle loading signal correctly during update process', fakeAsync(() => {
    const updatedCharacter = { ...mockCharacter, name: 'Birdperson' };

    component.update(updatedCharacter);
    expect(component.loading()).toBeTrue();

    tick(500);

    expect(component.loading()).toBeFalse();
  }));

});
