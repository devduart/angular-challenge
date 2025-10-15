import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of, shareReplay } from 'rxjs';
import { Character } from '../models/character.model';

@Injectable({ providedIn: 'root' })
export class CharactersService {
  private readonly API_URL = 'https://rickandmortyapi.com/api/character';
  private cacheAll$ = null as any;

  constructor(private http: HttpClient) {}

  getAll() {
    if (!this.cacheAll$) {
      this.cacheAll$ = this.http.get<{ results: Character[] }>(this.API_URL).pipe(
        map(r => r.results),
        catchError(() => of([])),
        shareReplay(1)
      );
    }
    return this.cacheAll$;
  }

  searchByName(name: string) {
    return this.http
      .get<{ results: Character[] }>(`${this.API_URL}/?name=${name}`)
      .pipe(map(r => r.results), catchError(() => of([])));
  }
}
