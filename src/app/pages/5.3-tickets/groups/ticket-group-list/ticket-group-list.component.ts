import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import TicketGroupParticipantComponent from '../../participants/ticket-group-participant/ticket-group-participant.component';
import { ETicketMessageStatus } from '../../ticket-message-status.enum';
import { TicketGroupService } from '../../ticket.service';
import TicketGroupAddOrEditComponent from '../ticket-group-add-or-edit/ticket-group-add-or-edit.component';

@Component({
  selector: 'app-ticket-group-list',
  templateUrl: './ticket-group-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgbDropdownModule, ButtonModule],
})
export default class TicketGroupListComponent implements OnInit {
  authService = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);
  swPush = inject(SwPush);
  router = inject(Router); // Injectamos Router.
  ticketGroupService = inject(TicketGroupService);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  error: string = '';
  dataSignal = signal<any>(null);
  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe((_) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const customerId = this.customerIdService.getCustomerId();
    const applicationUserId = this.authService.applicationUserId;

    const urlApi = `ticketGroup/GetAllByClient/${customerId}/${applicationUserId}`;
    this.apiRequestService
      .onGetList(urlApi)
      .then((result: any) => {
        // Actualizamos el valor del signal con los datos recibidos
        this.dataSignal.set(result);
      })
      .catch((error) => {
        console.log('🚀 ~ error:', error);
        this.error = error;
      });
  }
  onToggleStatus(id: string) {
    const urlApi = `ticketGroup/toggle-status/${id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.onLoadData();
    });
  }
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        TicketGroupAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalParticipants(data: any) {
    this.dialogHandlerService
      .openDialog(
        TicketGroupParticipantComponent,
        data,
        'Integrantes del grupo',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        this.onLoadData();
      });
  }

  onNavigateMessage(
    ticketGroupId: string,
    ticketGroupMessageStatus: ETicketMessageStatus
  ) {
    // this.ticketGroupService.ticketGroupId = ticketGroupId;
    this.ticketGroupService.ticketGroupMessageStatus = ticketGroupMessageStatus;
    this.ticketGroupService.setStatus(ticketGroupMessageStatus);
    this.router.navigate(['/tickets/messages/' + ticketGroupId]);
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`ticketGroup/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.set(
            this.dataSignal().filter((item) => item.id !== id)
          );
      });
  }
}
