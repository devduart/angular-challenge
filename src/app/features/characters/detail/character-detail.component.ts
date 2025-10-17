import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Character } from '../../../core/models/character.model';
import { CharactersService } from '../../../core/services/characters.service';
import { createCharactersStore } from '../state/characters.store';
import { CharacterEditComponent } from '../form/edit/character-edit.component';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatListModule],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent {
  private readonly dialogRef = inject(MatDialogRef<CharacterDetailComponent>);
  private readonly dialog = inject(MatDialog);
  private readonly service = inject(CharactersService);
  private readonly data = inject(MAT_DIALOG_DATA) as { character: Character };

  readonly character = signal(this.data.character);
  store = createCharactersStore(this.service);

  close() {
    this.dialogRef.close();
  }

  edit() {
    const ref = this.dialog.open(CharacterEditComponent, {
      width: '32rem',
      data: { character: this.character() },
    });

    ref.afterClosed().subscribe(updated => {
      if (updated) {
        this.character.set(updated);
        this.store.update(updated);
      }
    });
  }

  delete() {
    if (confirm(`Deseja realmente remover "${this.character().name}"?`)) {
      this.store.remove(this.character().id);
      this.dialogRef.close({ deleted: true });
    }
  }
}
