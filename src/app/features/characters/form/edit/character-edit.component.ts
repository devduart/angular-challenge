import { Component, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CharacterFormComponent } from '../character-form.component';
import { Character } from '../../../../core/models/character.model';
import { CharactersService } from '../../../../core/services/characters.service';
import { createCharactersStore } from '../../state/characters.store';
import { NotificationService } from '../../../../shared/components/notification/notification.service';

@Component({
  selector: 'app-character-edit',
  standalone: true,
  imports: [MatDialogModule, CharacterFormComponent],
  template: `
    <app-character-form (formSubmit)="update($event)" />
  `,
})
export class CharacterEditComponent {
  private readonly dialogRef = inject(MatDialogRef<CharacterEditComponent>);
  private readonly data = inject(MAT_DIALOG_DATA) as { character: Character };
  private readonly service = inject(CharactersService);
  private readonly notification = inject(NotificationService);
  readonly character = signal(this.data.character);
  store = createCharactersStore(this.service);
  loading = signal(false);

  constructor() {
    queueMicrotask(() => {
      const form = this.dialogRef.componentInstance;
      form?.initialData.set(this.character());
    });
  }

  update(data: Character) {
    this.loading.set(true);
    setTimeout(() => {
      this.store.update(data);
      this.loading.set(false);
      this.notification.info('Personagem Atualizado sucesso!');
      this.dialogRef.close(data);
    }, 500);
  }

}
