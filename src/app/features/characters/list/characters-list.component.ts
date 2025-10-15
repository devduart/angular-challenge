import { Component, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CharactersService } from '../../../core/services/characters.service';
import { createCharactersStore } from '../state/characters.store';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule
  ],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent implements OnInit, AfterViewInit {
  store = createCharactersStore(this.service);
  searchTerm = signal('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: CharactersService) {}

  ngOnInit() {
    this.store.loadPage(1);
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      const newPage = this.paginator.pageIndex + 1;
      this.store.loadPage(newPage);
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement | null;
    this.searchTerm.set(input?.value ?? '');
    this.store.search(this.searchTerm());
  }
}
