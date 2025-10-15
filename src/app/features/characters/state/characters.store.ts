import { signal, computed } from '@angular/core';
import { Character } from '../../../core/models/character.model';
import { CharactersService } from '../../../core/services/characters.service';

export function createCharactersStore(service: CharactersService) {
  const characters = signal<Character[]>([]);
  const loading = signal(false);
  const filter = signal('');
  const page = signal(1);
  const totalPages = signal(1);

  const filtered = computed(() =>
    characters().filter(c =>
      c.name.toLowerCase().includes(filter().toLowerCase())
    )
  );

  const loadPage = (p = 1) => {
    loading.set(true);
    const term = filter().trim();
    const req$ = term
      ? service.searchByName(term, p)
      : service.getPage(p);

    req$.subscribe({
      next: (res) => {
        characters.set(res.results);
        totalPages.set(res.info.pages);
        page.set(p);
      },
      error: () => loading.set(false),
      complete: () => loading.set(false)
    });
  };

  const nextPage = () => {
    if (page() < totalPages()) loadPage(page() + 1);
  };

  const prevPage = () => {
    if (page() > 1) loadPage(page() - 1);
  };

  const search = (term: string) => {
    filter.set(term);
    loadPage(1);
  };

  return Object.freeze({
    characters,
    filtered,
    loading,
    page,
    totalPages,
    loadPage,
    nextPage,
    prevPage,
    search
  });
}
