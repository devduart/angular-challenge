import { Component, OnInit, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { charactersStore } from '../state/characters.store';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent implements OnInit {
  store = charactersStore;
  searchTerm = signal('');

  ngOnInit() {
    this.store.loadAll();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement | null;
    this.searchTerm.set(input?.value ?? '');
    this.store.search(this.searchTerm());
  }
}
