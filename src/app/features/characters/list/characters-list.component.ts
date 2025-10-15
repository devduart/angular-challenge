import { Component, OnInit, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { CharactersService } from '../../../core/services/characters.service';
import { createCharactersStore } from '../state/characters.store';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [
    NgFor, NgIf,
    MatCardModule, MatProgressSpinnerModule,
    MatInputModule, MatFormFieldModule,
    MatPaginatorModule, MatButtonModule
  ],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent implements OnInit {
  store = createCharactersStore(this.service);
  searchTerm = signal('');
  constructor(private service: CharactersService) {}
  ngOnInit() { this.store.loadPage(1); }
  onSearch(e: Event) {
    const v = (e.target as HTMLInputElement | null)?.value ?? '';
    this.searchTerm.set(v); this.store.search(v);
  }
}
