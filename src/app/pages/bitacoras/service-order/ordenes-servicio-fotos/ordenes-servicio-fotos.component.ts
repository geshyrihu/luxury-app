import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-ordenes-servicio-fotos',
  templateUrl: './ordenes-servicio-fotos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, ImageModule],
})
export default class OrdenesServicioFotosComponent implements OnInit {
  config = inject(DynamicDialogConfig);
  custIdService = inject(CustomerIdService);
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);

  id: number = 0;

  data: any[] = [];
  nameCarpetaFecha = '';

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const customerId = this.custIdService.customerId;
    const urlApi = `ServiceOrders/OrdenesServicioFotos/${this.id}/${customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  deleteImg(id: number): void {
    const urlApi = `ServiceOrders/DeleteImg/${id}`;
    this.apiRequestService.onDelete(urlApi).then((result: any) => {
      this.onLoadData();
    });
  }
}
