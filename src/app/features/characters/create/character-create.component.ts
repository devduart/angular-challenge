import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CharactersService } from '../../../core/services/characters.service';
import { createCharactersStore } from '../state/characters.store';
import { Character } from '../../../core/models/character.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-character-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgIf
  ],
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.scss'],
})
export class CharacterCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CharacterCreateComponent>);
  private readonly service = inject(CharactersService);

  store = createCharactersStore(this.service);

  form = this.fb.group({
    name: ['', Validators.required],
    status: ['Alive'],
    species: ['Human'],
    gender: ['Male'],
    image: [''],
  });

  loading = signal(false);

  save() {
    if (this.form.invalid) return;

    const newCharacter: Character = {
      id: Date.now(),
      ...this.form.value,
      image: this.form.value.image || 'https://via.placeholder.com/200',
    } as Character;

    this.loading.set(true);
    setTimeout(() => {
      this.store.characters.update(prev => [newCharacter, ...prev]);
      this.loading.set(false);
      this.dialogRef.close(newCharacter);
    }, 800);
  }

  cancel() {
    this.dialogRef.close();
  }
}
