import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CharacterFormComponent } from '../character-form.component';
import { CharactersService } from '../../../../core/services/characters.service';
import { createCharactersStore } from '../../state/characters.store';
import { Character } from '../../../../core/models/character.model';
import { NotificationService } from '../../../../shared/components/notification/notification.service';

@Component({
  selector: 'app-character-create',
  standalone: true,
  imports: [MatDialogModule, CharacterFormComponent],
  template: `
    <app-character-form
      submitLabel="Criar"
      (formSubmit)="save($event)"
      (formCancel)="cancel()"
    />
  `
})
export class CharacterCreateComponent {
  private readonly dialogRef = inject(MatDialogRef<CharacterCreateComponent>);
  private readonly service = inject(CharactersService);
  private readonly notification = inject(NotificationService);
  store = createCharactersStore(this.service);
  loading = signal(false);

  save(data: Character) {
    const newCharacter = { ...data, id: Date.now() };
    this.loading.set(true);
    setTimeout(() => {
      this.store.add(newCharacter);
      this.loading.set(false);
      this.notification.success('Personagem criado com sucesso!');
      this.dialogRef.close(newCharacter);
    }, 500);
  }

  cancel() {
    this.dialogRef.close();
  }
}
