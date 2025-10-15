import { Routes } from '@angular/router';
import { CharactersListComponent } from './features/characters/list/characters-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'characters', pathMatch: 'full' },
  { path: 'characters', component: CharactersListComponent },
  { path: '**', redirectTo: 'characters' }
];
