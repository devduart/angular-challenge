import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CharacterCreateComponent } from '../../../features/characters/create/character-create.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly dark = signal(false);

  private readonly dialog = inject(MatDialog);

  toggleTheme() {
    this.dark.update(d => !d);
  }

  openCreateDialog() {
    this.dialog.open(CharacterCreateComponent, {
      width: '32rem',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '150ms',
    });
  }
}
