import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CharactersService, CharacterResponse } from './characters.service';

describe('CharactersService', () => {
  let service: CharactersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CharactersService]
    });
    service = TestBed.inject(CharactersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a page of characters', () => {
    const mockResponse: CharacterResponse = {
      info: { count: 20, pages: 2, next: 'next-url', prev: null },
      results: [{ id: 1, name: 'Rick', status: 'Alive', species: 'Human', image: 'url' }] as any[]
    };

    service.getPage(1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character?page=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error when getting a page of characters', () => {
    service.getPage(999).subscribe(response => {
      expect(response.results).toEqual([]);
      expect(response.info.count).toBe(0);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character?page=999');
    req.error(new ErrorEvent('Network error'));
  });

  it('should search characters by name', () => {
    const mockResponse: CharacterResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [{ id: 1, name: 'Rick', status: 'Alive', species: 'Human', image: 'url' }] as any[]
    };

    service.searchByName('Rick').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character/?name=Rick&page=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error when searching characters', () => {
    service.searchByName('NonExistentCharacter').subscribe(response => {
      expect(response.results).toEqual([]);
      expect(response.info.count).toBe(0);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character/?name=NonExistentCharacter&page=1');
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle call without page parameter', () => {
    service.getPage().subscribe(response => {
      expect(response.results).toBeDefined();
    });
    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character?page=1');
    req.flush({ info: { count: 0, pages: 0, next: null, prev: null }, results: [] });
  });

});