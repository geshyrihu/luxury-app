import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import LegalTicketAddComponent from './legal-ticket-add.component';
import { TicketTrakingCustomerComponent } from './ticket-traking-customer.component';
import TicketTrakingRequestDetailComponent from './ticket-traking-request-detail.component';

@Component({
  selector: 'app-legal-list-ticket-customer',
  templateUrl: './legal-list-ticket-customer.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalListTicketComponent implements OnInit {
  dialogHandlerService = inject(DialogHandlerService);
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);
  data: any[] = [];

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(`TicketLegal/All/${this.custIdService.getCustomerId()}`)
      .then((result: any) => {
        this.data = result;
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        LegalTicketAddComponent,
        data,
        '',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalSeguimientoCliente(data: any) {
    this.dialogHandlerService.openDialog(
      TicketTrakingCustomerComponent,
      data,
      '',
      this.dialogHandlerService.dialogSizeMd
    );
  }
  onModalViewDetail(data: any) {
    this.dialogHandlerService.openDialog(
      TicketTrakingRequestDetailComponent,
      data,
      '',
      this.dialogHandlerService.dialogSizeMd
    );
  }
}
