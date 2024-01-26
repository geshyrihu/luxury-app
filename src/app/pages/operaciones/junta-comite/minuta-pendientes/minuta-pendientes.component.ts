import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SanitizeHtmlPipe } from 'src/app/core/pipes/sanitize-html.pipe';
import { EStatusPipe } from 'src/app/core/pipes/status.pipe';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
@Component({
  selector: 'app-minuta-pendientes',
  templateUrl: './minuta-pendientes.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, EStatusPipe, SanitizeHtmlPipe],
  providers: [MessageService, CustomToastService],
})
export default class MinutaPendientesComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);
  data: any[] = [];
  todoElSeguimiento: boolean = true;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `Meetings/MinutaAllPendientes/${this.customerIdService.getcustomerId()}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
