import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import MaintenancePreventiveAddoreditComponent from 'src/app/pages/calendar/mantenimiento-preventivo/maintenance-preventive-addoredit.component';
import BitacoraIndividualComponent from '../../bitacoras/recorrido-mantenimiento/bitacora-individual.component';
import ActivosDocumentosComponent from './activos-documentos.component';
import AddOrEditActivosComponent from './addoredit-activos.component';
import FichaTecnicaActivoComponent from './ficha-tecnica-activo.component';
import ServiceHistoryMachineryComponent from './service-history-machinery.component';

@Component({
  selector: 'app-list-equipos',
  templateUrl: './list-equipos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListEquiposComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  custIdService = inject(CustomerIdService);
  authS = inject(AuthService);
  rutaActiva = inject(ActivatedRoute);
  router = inject(Router);

  subscriber: Subscription;

  customerId: number;
  customerId$: Observable<number> = this.custIdService.getCustomerId$();
  data: any[];
  datadetail: any[];
  paramId: string = '';
  ref: DynamicDialogRef;
  inventoryCategoryId: any;
  state: number = 0;
  subTitle: string = '';
  title: string = '';

  mostrarPreventivos: boolean = true;

  ngOnInit() {
    this.inventoryCategoryId = this.rutaActiva.snapshot.params.categoria;

    this.customerId$ = this.custIdService.getCustomerId$();
    this.customerId = this.custIdService.getCustomerId();
    this.onLoadData();
    this.subscriber = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((_) => {
        this.inventoryCategoryId = this.rutaActiva.snapshot.params.categoria;

        if (this.inventoryCategoryId == 3 || this.inventoryCategoryId == 4) {
          this.mostrarPreventivos = false;
        } else {
          this.mostrarPreventivos = true;
        }
        this.onLoadData();
      });
    this.customerId$.subscribe((resp) => {
      this.customerId = this.custIdService.getCustomerId();
      this.onLoadData();
    });
  }
  onLoadData() {
    if (this.state) this.subTitle = ' Inactivos';
    if (!this.state) this.subTitle = ' Activos';

    const urlApi = `Machineries/GetAll/${this.custIdService.customerId}/${this.inventoryCategoryId}/${this.state}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.OnChageTitle();
    });
  }
  onSelectState(value: number): void {
    this.state = value;
    this.onLoadData();
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`Machineries/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalFichatecnica(data: any) {
    this.dialogHandlerService
      .openDialog(
        FichaTecnicaActivoComponent,
        data,
        'Ficha Técnica',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  showModalAddoredit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditActivosComponent,
        {
          id: data.id,
          paramId: 1,
          inventoryCategory: this.inventoryCategoryId,
        },
        data.title,
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: any) => {
        if (result) this.onLoadData();
      });
  }
  showModalMaintenanceCalendar(data: any) {
    this.dialogHandlerService
      .openDialog(
        MaintenancePreventiveAddoreditComponent,
        {
          id: data.id,
          task: data.task,
          idMachinery: data.machineryId,
        },
        data.title,
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: any) => {
        if (result) this.onLoadData();
      });
  }

  onBitacoraIndividual(machineryId: number) {
    this.dialogHandlerService.openDialog(
      BitacoraIndividualComponent,
      {
        machineryId: machineryId,
      },
      '',
      this.dialogHandlerService.dialogSizeFull
    );
  }

  showModalAddOrEditCalendars(data: any) {
    this.dialogHandlerService
      .openDialog(
        MaintenancePreventiveAddoreditComponent,
        {
          id: data.id,
          task: data.activity,
          idMachinery: data.machineryId,
        },
        data.title,
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: any) => {
        if (result) this.onLoadData();
      });
  }
  onDocumentos(machineryId: number) {
    this.dialogHandlerService.openDialog(
      ActivosDocumentosComponent,
      {
        machineryId: machineryId,
      },
      'Documentos',
      this.dialogHandlerService.dialogSizeFull
    );
  }

  OnChageTitle() {
    if (this.inventoryCategoryId == 1) {
      this.title = 'Equipos Electromecanicos';
    }
    if (this.inventoryCategoryId == 2) {
      this.title = 'Amenidades';
    }
    if (this.inventoryCategoryId == 3) {
      this.title = 'Mobiliario';
    }
    if (this.inventoryCategoryId == 4) {
      this.title = 'Equipamiento';
    }
    if (this.inventoryCategoryId == 5) {
      this.title = 'Equipos de Gimnasio';
    }
    if (this.inventoryCategoryId == 6) {
      this.title = 'Equipos de Sistemas';
    }
    if (this.inventoryCategoryId == 8) {
      this.title = 'Areas Comunes';
    }
    if (this.inventoryCategoryId == 7) {
      this.title = 'Bodegas, Cuartos de Maquinas';
    }
  }

  onDeleteOrder(id: number) {
    this.apiRequestService
      .onDelete(`maintenancecalendars/${id}`)
      .then((result: any) => {
        this.onLoadData();
      });
  }

  onServiceHistory(id: number) {
    this.dialogHandlerService.openDialog(
      ServiceHistoryMachineryComponent,
      {
        id: id,
      },
      '',
      this.dialogHandlerService.dialogSizeFull
    );
  }
}
