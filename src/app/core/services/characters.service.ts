import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';
import { Character } from '../models/character.model';

export interface CharacterResponse {
  info: { pages: number; next: string | null; prev: string | null };
  results: Character[];
}

@Injectable({ providedIn: 'root' })
export class CharactersService {
  private readonly API_URL = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getPage(page = 1) {
    return this.http.get<CharacterResponse>(`${this.API_URL}?page=${page}`).pipe(
      map(r => r),
      catchError(() => of({ info: { pages: 0, next: null, prev: null }, results: [] }))
    );
  }

  searchByName(name: string, page = 1) {
    return this.http
      .get<CharacterResponse>(`${this.API_URL}/?name=${name}&page=${page}`)
      .pipe(
        map(r => r),
        catchError(() => of({ info: { pages: 0, next: null, prev: null }, results: [] }))
      );
  }
}
