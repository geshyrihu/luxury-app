import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IComiteVigilancia } from 'src/app/core/interfaces/comite-vigilancia.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import ComiteVigilanciaAddOrEditComponent from './comite-vigilancia-addoredit.component';

@Component({
  selector: 'app-comite-vigilancia-list',
  templateUrl: './comite-vigilancia-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ComiteVigilanciaListComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);
  custIdService = inject(CustomerIdService);

  data: IComiteVigilancia[] = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.custIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi =
      'ComiteVigilancia/GetAll/' + this.custIdService.getCustomerId();
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`comitevigilancia/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        ComiteVigilanciaAddOrEditComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
