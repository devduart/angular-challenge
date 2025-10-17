import { signal, computed, inject } from '@angular/core';
import { Character } from '../../../core/models/character.model';
import { CharactersService } from '../../../core/services/characters.service';
import { OverridesService } from '../../../core/services/overrides.service';

export function createCharactersStore(service: CharactersService) {
  const overrides = inject(OverridesService);

  const characters = signal<Character[]>([]);
  const loading = signal(false);
  const filter = signal('');
  const page = signal(1);
  const totalPages = signal(1);
  const totalItems = signal(0);
  const pageSize = 20;

  const filtered = computed(() => {
    const term = filter().toLowerCase().trim();
    return term
      ? characters().filter(c => c.name.toLowerCase().includes(term))
      : characters();
  });

  const loadPage = (p = 1) => {
    loading.set(true);
    const term = filter().trim();
    const req$ = term ? service.searchByName(term, p) : service.getPage(p);

    req$.subscribe({
      next: res => {
        const merged = overrides.apply(res.results);
        characters.set(merged);
        totalPages.set(res.info.pages);
        totalItems.set(res.info.count + overrides.extraCount());
        page.set(p);
      },
      error: () => loading.set(false),
      complete: () => loading.set(false),
    });
  };

  const add = (c: Character) => {
    overrides.add(c);
    characters.update(list => [c, ...list]);
  };

  const update = (updated: Character) => {
    const list = characters();
    const index = list.findIndex(c => c.id === updated.id);
    if (index !== -1) {
      const newList = [...list];
      newList[index] = updated;
      characters.set(newList);

      overrides.update(updated);

      return true;
    }

    return false;
  };


  const remove = (id: number) => {
    overrides.remove(id);
    characters.update(list => list.filter(c => c.id !== id));
  };

  const nextPage = () => { if (page() < totalPages()) loadPage(page() + 1); };
  const prevPage = () => { if (page() > 1) loadPage(page() - 1); };
  const search = (term: string) => { filter.set(term); loadPage(1); };

  return Object.freeze({
    characters,
    filtered,
    loading,
    page,
    totalPages,
    totalItems,
    pageSize,
    loadPage,
    nextPage,
    prevPage,
    search,
    add,
    update,
    remove,
  });
}
