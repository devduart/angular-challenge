import { Injectable, inject, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  success(message: string) {
    this.snack.open(message, 'OK', {
      duration: 2500,
      panelClass: ['notif-success'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  info(message: string) {
    this.snack.open(message, 'OK', {
      duration: 2500,
      panelClass: ['notif-info'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  error(message: string) {
    this.snack.open(message, 'Fechar', {
      duration: 3500,
      panelClass: ['notif-error'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  confirm(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(NotificationConfirmDialog, {
      data: { message },
      width: '320px',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '150ms',
    });
    return dialogRef.afterClosed().toPromise();
  }
}

@Component({
  selector: 'app-notification-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmação</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close="false">Cancelar</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Excluir</button>
    </mat-dialog-actions>
  `,
})
export class NotificationConfirmDialog {
  constructor(public data: { message: string }) {}
}
