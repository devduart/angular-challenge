import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationConfirmDialog } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog }
      ]
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success method', () => {
    it('should open a snackbar with success configuration', () => {
      const message = 'Operation successful';

      service.success(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'OK', {
        duration: 2500,
        panelClass: ['notif-success'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    });
  });

  describe('info method', () => {
    it('should open a snackbar with info configuration', () => {
      // Arrange
      const message = 'Information message';

      // Act
      service.info(message);

      // Assert
      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'OK', {
        duration: 2500,
        panelClass: ['notif-info'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    });
  });

  describe('error method', () => {
    it('should open a snackbar with error configuration', () => {
      const message = 'Error occurred';

      service.error(message);

      expect(mockSnackBar.open).toHaveBeenCalledWith(message, 'Fechar', {
        duration: 3500,
        panelClass: ['notif-error'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    });
  });

  describe('confirm method', () => {
    it('should open a dialog with the provided message', async () => {
      const message = 'Are you sure?';
      const mockDialogRef = {
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(true))
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);

      const result = await service.confirm(message);

      expect(mockDialog.open).toHaveBeenCalledWith(NotificationConfirmDialog, {
        data: { message },
        width: '320px',
        enterAnimationDuration: '200ms',
        exitAnimationDuration: '150ms',
      });
      expect(result).toBe(true);
    });

    it('should return the dialog result', async () => {
      const mockDialogRef = {
        afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(false))
      };
      mockDialog.open.and.returnValue(mockDialogRef as any);


      const result = await service.confirm('Are you sure?');


      expect(result).toBe(false);
    });
  });
});

describe('NotificationConfirmDialog', () => {
  it('should create with the provided message', () => {

    const message = 'Confirm this action?';

    const dialog = new NotificationConfirmDialog({ message });

    expect(dialog.data.message).toBe(message);
  });
});