import { signal, computed, inject } from '@angular/core';
import { Character } from '../../../core/models/character.model';
import { CharactersService } from '../../../core/services/characters.service';

export function createCharactersStore() {
  const service = inject(CharactersService);

  const characters = signal<Character[]>([]);
  const loading = signal(false);
  const filter = signal('');

  const filtered = computed(() =>
    characters().filter(c =>
      c.name.toLowerCase().includes(filter().toLowerCase())
    )
  );

  const loadAll = () => {
    loading.set(true);
    service.getAll().subscribe({
      next: (data: Character[]) => characters.set(data),
      error: () => loading.set(false),
      complete: () => loading.set(false)
    });
  };

  const search = (term: string) => filter.set(term);

  return Object.freeze({
    characters,
    filtered,
    loading,
    loadAll,
    search
  });
}

export const charactersStore = createCharactersStore();
