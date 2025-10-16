import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Character } from '../../../core/models/character.model';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatListModule],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent {
  private readonly dialogRef = inject(MatDialogRef<CharacterDetailComponent>);
  private readonly data = inject(MAT_DIALOG_DATA) as { character: Character };

  readonly character = signal(this.data.character);

  close() {
    this.dialogRef.close();
  }
}
