import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterFormComponent } from './character-form.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Character } from '../../../core/models/character.model';

class MockDialogRef {
  close = jasmine.createSpy('close');
}

describe('CharacterFormComponent', () => {
  let fixture: ComponentFixture<CharacterFormComponent>;
  let component: CharacterFormComponent;
  let dialogRef: MockDialogRef;

  const mockCharacter: Character = {
    id: 42,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'https://example.com/morty.jpg'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterFormComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [{ provide: MatDialogRef, useClass: MockDialogRef }]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterFormComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef) as any;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const formValue = component.form.value;
    expect(formValue.name).toBe('');
    expect(formValue.status).toBe('Alive');
    expect(formValue.species).toBe('Human');
    expect(formValue.gender).toBe('Male');
    expect(formValue.origin?.name).toBe('Desconhecida');
    expect(formValue.location?.name).toBe('Desconhecida');
  });

  it('should not change title and label if initialData remains null', () => {
    fixture.componentRef.setInput('initialData', null);
    fixture.detectChanges();

    expect(component.title()).toBe('Criar Novo Personagem');
    expect(component.submitLabel()).toBe('Salvar');
  });

  it('should emit formSubmit and close dialog when form is valid', () => {
    spyOn(component.formSubmit, 'emit');

    component.form.patchValue(mockCharacter);
    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not emit if form is invalid', () => {
    spyOn(component.formSubmit, 'emit');
    component.form.get('name')?.setValue('');
    component.onSubmit();

    expect(component.formSubmit.emit).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should use default image if none provided', () => {
    spyOn(component.formSubmit, 'emit');

    component.form.patchValue({
      name: 'Summer',
      status: 'Alive',
      species: 'Human',
      gender: 'Female',
      image: ''
    });

    component.onSubmit();

    const emitted = (component.formSubmit.emit as jasmine.Spy)
      .calls.mostRecent().args[0] as Character;

    expect(emitted.image).toBe('assets/images/default-profile.jpeg');
  });

  it('should keep user-provided image if present', () => {
    spyOn(component.formSubmit, 'emit');
    const customImg = 'https://example.com/custom.jpg';

    component.form.patchValue({
      name: 'Beth',
      status: 'Alive',
      species: 'Human',
      gender: 'Female',
      image: customImg
    });

    component.onSubmit();

    const emitted = (component.formSubmit.emit as jasmine.Spy)
      .calls.mostRecent().args[0] as Character;

    expect(emitted.image).toBe(customImg);
  });

  it('should close dialog when onCancel() is called', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should patch only provided fields when updating with partial data', () => {
    const partialData = { name: 'Birdperson' };
    fixture.componentRef.setInput('initialData', partialData as any);
    fixture.detectChanges();

    expect(component.form.value.name).toBe('Birdperson');
    expect(component.form.value.status).toBe('Alive');
  });
});
function fakeAsync(arg0: () => void): jasmine.ImplementationCallback | undefined {
  throw new Error('Function not implemented.');
}

function tick() {
  throw new Error('Function not implemented.');
}

