import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditElevatorSparePartsChangeComponent from './add-or-edit-elevator-spare-parts-change.component';

@Component({
  selector: 'app-list-elevator-spare-parts-change',
  templateUrl: './list-elevator-spare-parts-change.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListElevatorSparePartsChangeComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  custIdService = inject(CustomerIdService);

  data: any[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  customerId$: Observable<number> = this.custIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `ElevatorSparePartsChange/list/${this.custIdService.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`ElevatorSparePartsChange/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditElevatorSparePartsChangeComponent,
        {
          id: data.id,
          customerId: this.custIdService.customerId,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
