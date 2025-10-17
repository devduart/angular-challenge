import { Component, signal, effect, inject, EventEmitter, Output, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { Character } from '../../../core/models/character.model';

@Component({
  selector: 'app-character-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogActions,
  ],
  templateUrl: './character-form.component.html',
  styleUrls: ['./character-form.component.scss'],
})
export class CharacterFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CharacterFormComponent>);

  initialData = input<Character | null>(null);
  submitLabel = signal('Salvar');
  title = signal('Criar Novo Personagem');

  @Output() formSubmit = new EventEmitter<Character>();

  form = this.fb.group({
    name: ['', Validators.required],
    status: ['Alive', Validators.required],
    species: ['Human', Validators.required],
    gender: ['Male', Validators.required],
    origin: this.fb.group({
      name: ['Desconhecida'],
      url: [''],
    }),
    location: this.fb.group({
      name: ['Desconhecida'],
      url: [''],
    }),
    image: [''],
  });

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.form.patchValue(data);
        this.title.set('Editar Personagem');
        this.submitLabel.set('Atualizar');
      }
    },
    { allowSignalWrites: true }
  );
  }

  onSubmit() {
    if (this.form.invalid) return;
    const defaultImage = 'assets/images/default-profile.jpeg';

    const data = {
      ...this.form.value,
      image: this.form.value.image || defaultImage,
    } as Character;

    this.formSubmit.emit(data);
    this.dialogRef.close(data);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
