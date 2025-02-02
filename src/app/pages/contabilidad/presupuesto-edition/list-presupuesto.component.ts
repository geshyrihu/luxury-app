import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import PeriodoCedulaPresupuestalAddoreditComponent from 'src/app/pages/compras/cedula-presupuestal/periodo-cedula-addoredit.component';
import PresupuestoAddComponent from './presupuesto-add.component';

@Component({
  selector: 'app-list-presupuesto',
  templateUrl: './list-presupuesto.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListPresupuestoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);
  custIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  router = inject(Router);

  data: any[] = [];
  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.custIdService.getCustomerId$();

  ngOnInit() {
    this.onLoadData();
    this.customerId$ = this.custIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    this.apiRequestService
      .onGetList(`Presupuesto/GetList/${this.custIdService.customerId}`)
      .then((result: any) => {
        this.data = result;
      });
  }

  onFinished(cedulaId: number, finished: boolean) {
    this.apiRequestService
      .onGetItem(`Presupuesto/Finished/${cedulaId}/${finished}`)
      .then((result: any) => {
        // Actualiza solo el registro afectado en lugar de toda la lista
        const updatedRecord = result;
        const recordIndex = this.data.findIndex(
          (record) => record.id === updatedRecord.id
        );
        if (recordIndex !== -1) {
          this.data[recordIndex] = updatedRecord;
        }
        this.customToastService.onCloseToSuccess();
      });
  }

  onAddPresupuesto(id: number) {
    this.dialogHandlerService
      .openDialog(
        PresupuestoAddComponent,
        {
          id: id,
        },
        'Agregar presupuesto',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalAddOrEdit(id: number) {
    this.dialogHandlerService
      .openDialog(
        PeriodoCedulaPresupuestalAddoreditComponent,
        {
          cedulaId: id,
        },
        'Editar Periodo',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onGetPresupuestoDetalle(id: number) {
    this.router.navigate(['//compras/presupuesto-individual/', id]);
  }

  // Función para eliminar
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`presupuesto/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
