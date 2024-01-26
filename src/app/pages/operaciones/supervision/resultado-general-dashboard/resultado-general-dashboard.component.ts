import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-resultado-general-dashboard',
  templateUrl: './resultado-general-dashboard.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    NgbModule,
    TableModule,
    MultiSelectModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ResultadoGeneralDashboardComponent
  implements OnInit, OnDestroy
{
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public periodoMonthService = inject(PeriodoMonthService);
  public selectItemService = inject(SelectItemService);
  public customToastService = inject(CustomToastService);

  reporteFiltro: string = 'MINUTAS GENERAL';

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ref: DynamicDialogRef;
  data: any[] = [];
  cb_customers: any[] = [];
  periodo: string = '';
  nivelReporte: number = 0;
  mostrar: boolean = false;

  ngOnInit(): void {
    this.selectItemService
      .getCustomersNombreCorto()
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.cb_customers = resp;
      });
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadDataMinutas();
  }

  onFiltrarPeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadDataMinutas();
  }

  onFiltrarData(item: string) {
    this.reporteFiltro = item;
    this.onLoadDataMinutas();
  }

  onLoadDataMinutas() {
    this.reporteFiltro = 'MINUTAS GENERAL';
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `ResumenGeneral/ReporteResumenMinutas/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}/${this.nivelReporte}`
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
  onLoadDataMinutaFiltro(EAreaMinutasDetalles: number, reporteFiltro: string) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `ResumenGeneral/ReporteResumenMinutasFiltro/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}/${EAreaMinutasDetalles}/${this.nivelReporte}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.reporteFiltro = reporteFiltro;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onLoadDataPreventivos() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `ResumenGeneral/ReporteResumenPreventivos/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.reporteFiltro = 'MANTENIMIENTOS PREVENTIVOS';
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onLoadDataTickets() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `ResumenGeneral/ReporteResumenTicket/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.reporteFiltro = 'TICKETS';
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onValueProgress(value: number) {
    let color = '';
    if (value <= 94) {
      color = 'danger';
    }
    if (value >= 100) {
      color = 'success';
    }
    if (value >= 95 && value <= 99) {
      color = 'warning';
    }
    return color;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
