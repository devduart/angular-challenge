import { TestBed } from '@angular/core/testing';
import { createCharactersStore } from './characters.store';
import { CharactersService } from '../../../core/services/characters.service';
import { OverridesService } from '../../../core/services/overrides.service';
import { Character } from '../../../core/models/character.model';
import { of, throwError } from 'rxjs';

class MockCharactersService {
  getPage = jasmine.createSpy('getPage');
  searchByName = jasmine.createSpy('searchByName');
}

class MockOverridesService {
  apply = jasmine.createSpy('apply').and.callFake((res: Character[]) => res);
  extraCount = jasmine.createSpy('extraCount').and.returnValue(0);
  add = jasmine.createSpy('add');
  update = jasmine.createSpy('update');
  remove = jasmine.createSpy('remove');
}

describe('createCharactersStore', () => {
  let service: MockCharactersService;
  let overrides: MockOverridesService;
  let store: ReturnType<typeof createCharactersStore>;

  const mockCharacters: Character[] = [
    { id: 1, name: 'Rick' } as any,
    { id: 2, name: 'Morty' } as any,
  ];

  const mockResponse = {
    info: { count: 2, pages: 1, next: null, prev: null },
    results: mockCharacters,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CharactersService, useClass: MockCharactersService },
        { provide: OverridesService, useClass: MockOverridesService },
      ],
    });

    service = TestBed.inject(CharactersService) as any;
    overrides = TestBed.inject(OverridesService) as any;


    store = TestBed.runInInjectionContext(() => createCharactersStore(service as any));
  });

  it('should create store with default state', () => {
    expect(store.characters()).toEqual([]);
    expect(store.loading()).toBeFalse();
    expect(store.page()).toBe(1);
    expect(store.totalPages()).toBe(1);
    expect(store.totalItems()).toBe(0);
  });

  it('should load characters using getPage() when filter is empty', () => {
    service.getPage.and.returnValue(of(mockResponse));
    store.loadPage(1);

    expect(service.getPage).toHaveBeenCalledWith(1);
    expect(overrides.apply).toHaveBeenCalledWith(mockCharacters);
    expect(store.characters().length).toBe(2);
    expect(store.loading()).toBeFalse();
  });

  it('should load characters using searchByName() when filter is set', () => {
    service.searchByName.and.returnValue(of(mockResponse));
    store.search('rick');

    expect(service.searchByName).toHaveBeenCalledWith('rick', 1);
    expect(overrides.apply).toHaveBeenCalled();
    expect(store.characters().length).toBe(2);
  });

  it('should handle error response gracefully', () => {
    service.getPage.and.returnValue(throwError(() => new Error('Network error')));
    store.loadPage(1);

    expect(store.loading()).toBeFalse();
  });

  it('should add a new character and call overrides.add()', () => {
    const newChar = { id: 3, name: 'Summer' } as any;
    store.add(newChar);

    expect(overrides.add).toHaveBeenCalledWith(newChar);
    expect(store.characters()[0]).toEqual(newChar);
  });

  it('should update an existing character and call overrides.update()', () => {
    store.characters.set(mockCharacters);
    const updated = { id: 2, name: 'Morty Updated' } as any;

    const result = store.update(updated);

    expect(result).toBeTrue();
    expect(overrides.update).toHaveBeenCalledWith(updated);
    expect(store.characters()[1].name).toBe('Morty Updated');
  });

  it('should return false when updating non-existent character', () => {
    const result = store.update({ id: 999, name: 'Ghost' } as any);
    expect(result).toBeFalse();
  });

  it('should remove a character and call overrides.remove()', () => {
    store.characters.set(mockCharacters);
    store.remove(1);

    expect(overrides.remove).toHaveBeenCalledWith(1);
    expect(store.characters().length).toBe(1);
    expect(store.characters()[0].id).toBe(2);
  });

  it('should call loadPage with the next page number when nextPage is called', () => {
    service.getPage.and.returnValue(of(mockResponse));
    store.page.set(2);
    store.totalPages.set(5);

    store.nextPage();

    expect(service.getPage).toHaveBeenCalledWith(3);
  });

  it('should not call loadPage if on the last page when nextPage is called', () => {
    service.getPage.calls.reset();
    store.page.set(5);
    store.totalPages.set(5);

    store.nextPage();

    expect(service.getPage).not.toHaveBeenCalled();
  });

  it('should call loadPage with the previous page number when prevPage is called', () => {
    service.getPage.and.returnValue(of(mockResponse));
    store.page.set(3);
    store.totalPages.set(5);

    store.prevPage();

    expect(service.getPage).toHaveBeenCalledWith(2);
  });

  it('should not call loadPage if on the first page when prevPage is called', () => {
    service.getPage.calls.reset();
    store.page.set(1);
    store.totalPages.set(5);

    store.prevPage();

    expect(service.getPage).not.toHaveBeenCalled();
  });

  it('should filter characters on the client-side based on the filter signal', () => {
    service.searchByName.and.returnValue(of({ info: { pages: 1, count: 0 }, results: [] }));

    const testCharacters = [
        { id: 1, name: 'Rick Sanchez' },
        { id: 2, name: 'Morty Smith' },
        { id: 3, name: 'Summer Smith' },
    ] as any[];
    store.characters.set(testCharacters);

    expect(store.filtered().length).toBe(3);

    store.search('smith');

    store.characters.set(testCharacters);

    expect(store.filtered().length).toBe(2);
    expect(store.filtered().map(c => c.name)).toEqual(['Morty Smith', 'Summer Smith']);
  });
});
