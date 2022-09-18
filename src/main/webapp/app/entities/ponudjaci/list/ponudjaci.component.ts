import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPonudjaci } from '../ponudjaci.model';
import { PonudjaciService } from '../service/ponudjaci.service';
import { PonudjaciDeleteDialogComponent } from '../delete/ponudjaci-delete-dialog.component';
import { NotificationService } from '../../../shared/Notification.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'jhi-ponudjaci',
  templateUrl: './ponudjaci.component.html',
})
export class PonudjaciComponent implements OnInit {
  ponudjacis?: IPonudjaci[];
  isLoading = false;

  constructor(
    protected ponudjaciService: PonudjaciService,
    protected modalService: NgbModal,
    private notificationService: NotificationService
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.ponudjaciService.query().subscribe({
      next: (res: HttpResponse<IPonudjaci[]>) => {
        this.isLoading = false;
        this.ponudjacis = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPonudjaci): number {
    return item.id!;
  }

  delete(ponudjaci: IPonudjaci): void {
    const modalRef = this.modalService.open(PonudjaciDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ponudjaci = ponudjaci;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.successMessage$.subscribe();
        this.loadAll();
      }
    });
  }
  successMessage$ = this.notificationService.successMessageAction$.pipe(
    tap(message => {
      if (message) {
        setTimeout(() => {
          this.notificationService.clearAllMessages();
        }, 5000);
      }
    })
  );
  errorMessage$ = this.notificationService.errorMessageAction$.pipe(
    tap(message => {
      if (message) {
        setTimeout(() => {
          this.notificationService.clearAllMessages();
        }, 5000);
      }
    })
  );
}
