import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { ICustomer } from 'src/app/core/interfaces/customer.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CustomerAddOrEditComponent from './customer-addoredit.component';
import CustomerAddressComponent from './customer-address.component';
import CustomerImagesComponent from './customer-images.component';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListCustomerComponent implements OnInit {
  dialogHandlerService = inject(DialogHandlerService);
  apiRequestService = inject(ApiRequestService);

  data: ICustomer[] = [];
  ref: DynamicDialogRef;
  title = 'Activos';
  state = true;
  mostrar = true;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(`Customers/GetAllAsync/${this.state}`)
      .then((result: any) => {
        this.data = result;
      });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`customers/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        CustomerAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onUpdateImages(customerId: number) {
    this.dialogHandlerService
      .openDialog(
        CustomerImagesComponent,
        { customerId },
        'Actualizar Imagenes',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onUpdateAddress(customerId: number) {
    this.dialogHandlerService
      .openDialog(
        CustomerAddressComponent,
        { customerId },
        'Actualizar Direccion',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onSortChange(valor: any) {
    this.state = valor;
    this.state === true ? (this.title = 'Activos') : (this.title = 'Inctivos');
    this.onLoadData();
  }
}
