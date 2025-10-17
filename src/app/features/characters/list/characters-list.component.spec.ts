import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharactersListComponent } from './characters-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { CharactersService } from '../../../core/services/characters.service';
import { Character } from '../../../core/models/character.model';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CharacterDetailComponent } from '../detail/character-detail.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('CharactersListComponent', () => {
  let component: CharactersListComponent;
  let fixture: ComponentFixture<CharactersListComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockCharactersService: jasmine.SpyObj<CharactersService>;
  let mockStore: any;

  const mockCharacters: Character[] = [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      image: 'https://example.com/rick.jpg'
    },
    {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      image: 'https://example.com/morty.jpg'
    }
  ];

  beforeEach(async () => {
    // Create mock services
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockCharactersService = jasmine.createSpyObj('CharactersService', ['getAll']);

    // Create mock store
    mockStore = {
      loading: jasmine.createSpy('loading').and.returnValue(false),
      filtered: jasmine.createSpy('filtered').and.returnValue(mockCharacters),
      totalItems: jasmine.createSpy('totalItems').and.returnValue(20),
      page: jasmine.createSpy('page').and.returnValue(1),
      pageSize: 20,
      loadPage: jasmine.createSpy('loadPage'),
      search: jasmine.createSpy('search')
    };

    await TestBed.configureTestingModule({
      imports: [
        CharactersListComponent,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatPaginatorModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: CharactersService, useValue: mockCharactersService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharactersListComponent);
    component = fixture.componentInstance;

    // Replace the real store with our mock
    component.store = mockStore;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchTerm as empty string', () => {
    expect(component.searchTerm()).toBe('');
  });

  it('should load first page on init', () => {
    component.ngOnInit();
    expect(mockStore.loadPage).toHaveBeenCalledWith(1);
  });

  describe('onSearch method', () => {
    it('should update searchTerm and call store.search with input value', () => {
      const searchValue = 'Rick';
      const mockEvent = {
        target: { value: searchValue }
      } as unknown as Event;

      component.onSearch(mockEvent);

      expect(component.searchTerm()).toBe(searchValue);
      expect(mockStore.search).toHaveBeenCalledWith(searchValue);
    });

    it('should handle null event target gracefully', () => {
      const mockEvent = { target: null } as unknown as Event;

      component.onSearch(mockEvent);

      expect(component.searchTerm()).toBe('');
      expect(mockStore.search).toHaveBeenCalledWith('');
    });
  });

  describe('openDetail method', () => {
    it('should open dialog with character data', () => {
      const mockDialogRef = {
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(null))
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);

      const character = mockCharacters[0];
      component.openDetail(character);

      expect(mockDialog.open).toHaveBeenCalledWith(CharacterDetailComponent, {
        data: { character },
        panelClass: 'detail-dialog',
        autoFocus: false
      });
    });

    it('should reload current page when dialog closes with deleted=true', () => {
      const mockDialogRef = {
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of({ deleted: true }))
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);

      component.openDetail(mockCharacters[0]);

      expect(mockStore.loadPage).toHaveBeenCalledWith(1); // Assuming page() returns 1
    });

    it('should reload current page when dialog closes with updated=true', () => {
      const mockDialogRef = {
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of({ updated: true }))
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);

      component.openDetail(mockCharacters[0]);

      expect(mockStore.loadPage).toHaveBeenCalledWith(1); // Assuming page() returns 1
    });

    it('should not reload page when dialog closes without deleted or updated', () => {
      const mockDialogRef = {
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(null))
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);

      // Reset the spy to clear previous calls
      mockStore.loadPage.calls.reset();

      component.openDetail(mockCharacters[0]);

      expect(mockStore.loadPage).not.toHaveBeenCalled();
    });
  });

  describe('template', () => {
    it('should show loading spinner when store.loading is true', () => {
      // Update mock to return true for loading
      mockStore.loading.and.returnValue(true);
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('mat-spinner'));
      expect(spinner).toBeTruthy();

      const grid = fixture.debugElement.query(By.css('.characters-grid'));
      expect(grid).toBeFalsy();
    });

    it('should show character grid when store.loading is false', () => {
      // Update mock to return false for loading
      mockStore.loading.and.returnValue(false);
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('mat-spinner'));
      expect(spinner).toBeFalsy();

      const grid = fixture.debugElement.query(By.css('.characters-grid'));
      expect(grid).toBeTruthy();
    });

    it('should render character cards for each character in store.filtered', () => {
      mockStore.loading.and.returnValue(false);
      fixture.detectChanges();

      const cards = fixture.debugElement.queryAll(By.css('.character-card'));
      expect(cards.length).toBe(mockCharacters.length);
    });

    it('should display character name and details in card', () => {
      mockStore.loading.and.returnValue(false);
      fixture.detectChanges();

      const firstCard = fixture.debugElement.query(By.css('.character-card'));
      const nameElement = firstCard.query(By.css('h5'));
      const detailsElement = firstCard.query(By.css('p'));

      expect(nameElement.nativeElement.textContent).toContain(mockCharacters[0].name);
      expect(detailsElement.nativeElement.textContent).toContain(mockCharacters[0].species);
      expect(detailsElement.nativeElement.textContent).toContain(mockCharacters[0].status);
    });

    it('should open detail dialog when character card is clicked', () => {
      mockStore.loading.and.returnValue(false);
      fixture.detectChanges();

      spyOn(component, 'openDetail');

      const firstCard = fixture.debugElement.query(By.css('.character-card'));
      firstCard.triggerEventHandler('click', null);

      expect(component.openDetail).toHaveBeenCalledWith(mockCharacters[0]);
    });

    it('should update search term when input changes', () => {
      spyOn(component, 'onSearch');

      const input = fixture.debugElement.query(By.css('input'));
      input.triggerEventHandler('input', { target: { value: 'Rick' } });

      expect(component.onSearch).toHaveBeenCalled();
    });

    it('should configure paginator with correct values', () => {
      const paginatorDebug = fixture.debugElement.query(By.directive(MatPaginator));
      const paginatorInstance = paginatorDebug.componentInstance as MatPaginator;

      expect(paginatorInstance.length).toBe(20);     // mockStore.totalItems()
      expect(paginatorInstance.pageSize).toBe(20);   // mockStore.pageSize
      expect(paginatorInstance.pageIndex).toBe(0);   // mockStore.page() - 1
    });

  });
});