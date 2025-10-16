import { Injectable, signal, computed } from '@angular/core';
import { Character } from '../models/character.model';

@Injectable({ providedIn: 'root' })
export class OverridesService {
  private readonly created = signal<Character[]>([]);
  private readonly updated = signal<Record<number, Character>>({});
  private readonly deletedIds = signal<Set<number>>(new Set());

  /** Adiciona novo personagem */
  add(character: Character) {
    this.created.update(list => [character, ...list]);
  }

  /** Atualiza personagem */
  update(character: Character) {
    this.updated.update(map => ({ ...map, [character.id]: character }));
  }

  /** Marca personagem como removido */
  remove(id: number) {
    this.deletedIds.update(set => new Set(set).add(id));
  }

  /** Aplica overrides sobre a lista da API */
  apply(list: Character[]): Character[] {
    const deleted = this.deletedIds();
    const updated = this.updated();
    const added = this.created();

    const result = list
      .filter(c => !deleted.has(c.id))
      .map(c => (updated[c.id] ? updated[c.id] : c));

    return [...added, ...result];
  }

  extraCount(): number {
    return this.created().length;
  }

  reset() {
    this.created.set([]);
    this.updated.set({});
    this.deletedIds.set(new Set());
  }
}
