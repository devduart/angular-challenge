import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Character } from '../models/character.model';

export interface CharacterResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

@Injectable({ providedIn: 'root' })
export class CharactersService {
  private readonly API_URL = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getPage(page = 1): Observable<CharacterResponse> {
    return this.http.get<CharacterResponse>(`${this.API_URL}?page=${page}`).pipe(
      map(res => res),
      catchError(() =>
        of({
          info: { count: 0, pages: 0, next: null, prev: null },
          results: [],
        } satisfies CharacterResponse) // 👈 garante o mesmo tipo
      )
    );
  }

  searchByName(name: string, page = 1): Observable<CharacterResponse> {
    return this.http
      .get<CharacterResponse>(`${this.API_URL}/?name=${name}&page=${page}`)
      .pipe(
        map(res => res),
        catchError(() =>
          of({
            info: { count: 0, pages: 0, next: null, prev: null },
            results: [],
          } satisfies CharacterResponse) // 👈 mesmo aqui
        )
      );
  }
}
