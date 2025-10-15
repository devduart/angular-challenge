import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { Character } from '../../../core/models/character.model';
import { inject as ngInject } from '@angular/core';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [NgIf, MatDialogModule, MatIconModule],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent {
  private readonly dialogRef = inject(MatDialogRef<CharacterDetailComponent>);
  private readonly data = ngInject(MAT_DIALOG_DATA) as { character: Character };

  readonly character = signal(this.data.character);

  close() {
    this.dialogRef.close();
  }
}
