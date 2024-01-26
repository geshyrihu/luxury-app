import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import PhoneFormatPipe from 'src/app/core/pipes/phone-format.pipe';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import { StatusSolicitudVacanteService } from 'src/app/core/services/status-solicitud-vacante.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddoreditSolicitudBajaComponent from '../../list-solicitudes/list-solicitud-baja/addoredit-solicitud-baja/addoredit-solicitud-baja.component';
import AddOrEditStatusRequestDismissalDiscountComponent from './addoredit-status-request-dismissal-discount/addoredit-status-request-dismissal-discount.component';

@Component({
  selector: 'app-status-request-dismissal',
  templateUrl: './status-request-dismissal.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    PrimeNgModule,
    FormsModule,
    CommonModule,
    CustomInputModule,
    PhoneFormatPipe,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class StatusRequestDismissalComponent
  implements OnInit, OnDestroy
{
  private statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public router = inject(Router);
  public customToastService = inject(CustomToastService);

  workPositionId = this.statusSolicitudVacanteService.getworkPositionId();
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any;
  noCandidates: boolean = true;
  pahtBaseImg = environment.base_urlImg + 'Administration/accounts/';
  applicationUserId: string =
    this.authService.infoUserAuthDto.applicationUserId;
  ngOnInit() {
    if (this.workPositionId === null) {
      this.router.navigateByUrl('/reclutamiento/plantilla-interna');
    }
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('RequestDismissal/' + this.workPositionId)
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

  //Ver tarjeta de Colaborador
  onCardEmployee(employeeId: any) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId: employeeId,
      },
      header: 'Tarjeta de Colaborador',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }

  //Editar solicitud de baja
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(
      // AddOrEditStatusRequestDismissalComponent,
      AddoreditSolicitudBajaComponent,
      {
        data: {
          id: data.id,
        },
        header: data.title,
        styleClass: 'modal-md',
        closeOnEscape: true,
        baseZIndex: 10000,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  //Eliminar solicitud de baja
  onDelete(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`RequestDismissal/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y volver a cargar los datos
          this.customToastService.onCloseToSuccess();
          this.onLoadData();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  //Editar solicitud de Discounts
  onModalAddOrEditDiscounts(data: any) {
    this.ref = this.dialogService.open(
      AddOrEditStatusRequestDismissalDiscountComponent,
      {
        data: {
          id: data.id,
        },
        header: data.title,
        styleClass: 'modal-md',
        closeOnEscape: true,
        baseZIndex: 10000,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  //Eliminar solicitud de baja
  onDeleteDiscounts(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`RequestDismissalDiscount/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.onLoadData();
          // Mostrar un mensaje de éxito y cerrar Loading....
          this.customToastService.onCloseToSuccess();
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
