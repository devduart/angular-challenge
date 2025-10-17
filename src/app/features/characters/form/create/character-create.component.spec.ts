import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CharacterCreateComponent } from './character-create.component';
import { MatDialogRef } from '@angular/material/dialog';
import { CharactersService } from '../../../../core/services/characters.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { Character } from '../../../../core/models/character.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockDialogRef {
  close = jasmine.createSpy('close');
}

class MockCharactersService {}

class MockNotificationService {
  success = jasmine.createSpy('success');
}

describe('CharacterCreateComponent', () => {
  let component: CharacterCreateComponent;
  let fixture: ComponentFixture<CharacterCreateComponent>;
  let dialogRef: MockDialogRef;
  let notification: MockNotificationService;
  let mockStore: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CharacterCreateComponent,
        NoopAnimationsModule // ✅ Corrige o erro @transitionMessages
      ],
      providers: [
        { provide: MatDialogRef, useClass: MockDialogRef },
        { provide: CharactersService, useClass: MockCharactersService },
        { provide: NotificationService, useClass: MockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterCreateComponent);
    component = fixture.componentInstance;

    mockStore = { add: jasmine.createSpy('add') };
    component.store = mockStore;

    dialogRef = TestBed.inject(MatDialogRef) as any;
    notification = TestBed.inject(NotificationService) as any;

    fixture.detectChanges();
  });

  it('must create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when canceling', () => {
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('must create character and call notifications on save()', fakeAsync(() => {
    const fakeCharacter: Character = { id: 0, name: 'Rick', status: 'Alive' } as any;

    component.save(fakeCharacter);
    expect(component.loading()).toBeTrue();

    tick(500);

    expect(mockStore.add).toHaveBeenCalled();
    expect(notification.success).toHaveBeenCalledWith('Personagem criado com sucesso!');
    expect(dialogRef.close).toHaveBeenCalled();
    expect(component.loading()).toBeFalse();
  }));
});
