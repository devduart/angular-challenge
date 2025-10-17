import { TestBed } from '@angular/core/testing';
import { OverridesService } from './overrides.service';
import { Character } from '../models/character.model';

describe('OverridesService', () => {
  let service: OverridesService;
  const mockCharacter: Character = {
    id: 1,
    name: 'Test Character',
    status: 'Alive',
    species: 'Human',
    image: 'test.jpg'
  } as Character;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverridesService]
    });
    service = TestBed.inject(OverridesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new character', () => {
    service.add(mockCharacter);
    const result = service.apply([]);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(mockCharacter);
  });

  it('should update a character', () => {
    const updatedCharacter = { ...mockCharacter, name: 'Updated Name' };
    service.update(updatedCharacter);
    const result = service.apply([mockCharacter]);
    expect(result[0].name).toBe('Updated Name');
  });

  it('should remove a character', () => {
    service.remove(1);
    const result = service.apply([mockCharacter]);
    expect(result.length).toBe(0);
  });

  it('should apply all overrides correctly', () => {
    // Add a character
    const newCharacter = { ...mockCharacter, id: 999 };
    service.add(newCharacter);

    // Update a character
    const updatedCharacter = { ...mockCharacter, name: 'Updated Name' };
    service.update(updatedCharacter);

    // Remove a character
    service.remove(2);

    const originalList = [
      mockCharacter,
      { id: 2, name: 'To Be Removed', status: 'Dead', species: 'Alien', image: 'removed.jpg' } as Character
    ];

    const result = service.apply(originalList);

    expect(result.length).toBe(2); // 1 original (updated) + 1 added - 1 removed
    expect(result.find(c => c.id === 1)?.name).toBe('Updated Name');
    expect(result.find(c => c.id === 999)).toBeTruthy();
    expect(result.find(c => c.id === 2)).toBeFalsy();
  });

  it('should return correct extra count', () => {
    service.add(mockCharacter);
    service.add({ ...mockCharacter, id: 2 } as Character);
    expect(service.extraCount()).toBe(2);
  });

  it('should reset all overrides', () => {
    service.add(mockCharacter);
    service.update({ ...mockCharacter, id: 2 } as Character);
    service.remove(3);

    service.reset();

    const result = service.apply([mockCharacter]);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(mockCharacter);
    expect(service.extraCount()).toBe(0);
  });
});