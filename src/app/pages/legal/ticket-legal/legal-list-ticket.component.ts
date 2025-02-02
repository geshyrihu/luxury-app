// Imports propios de Angular
import { Component, OnInit, inject } from '@angular/core';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';

// Imports creados por tu servidor
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import LegalTicketAddComponent from './legal-ticket-add.component';
import LegalTicketEditComponent from './legal-ticket-edit.component';
import LegalTicketUpdateStatusComponent from './legal-ticket-update-status.component';
import TicketTrakingRequestDetailComponent from './ticket-traking-request-detail.component';
import TicketTrakingComponent from './ticket-traking.component';

@Component({
  selector: 'app-legal-list-ticket',
  templateUrl: './legal-list-ticket.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalListTicketComponent implements OnInit {
  private dialogHandlerService = inject(DialogHandlerService);
  private apiRequestService = inject(ApiRequestService);
  private authS = inject(AuthService);

  isSuperUser = this.authS.onValidateRoles(['SuperUsuario']);

  data: any[] = [];
  inputValue: string = '';

  ngOnInit() {
    this.onLoadData();
    // this.onModalAddOrEdit({ id: '', title: 'AGREGAR TICKET LEGAL' });
  }

  onLoadData() {
    this.apiRequestService
      .onGetList('TicketLegal/AllLegal')
      .then((result: any) => {
        this.data = result;
      });
  }

  // clearInput() {
  //   this.inputValue = null; // Establece el valor del input en null
  //   this.onFilter(null); // Llama a la función onFilter con el valor null
  // }

  // onFilter(mesanio: any) {
  //   this.apiRequestService
  //     .onGetList('TicketLegal/AllLegal/' + mesanio)
  //     .then((result: any) => {
  //       this.data = result;
  //     });
  // }
  onModalEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        LegalTicketEditComponent,
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

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        LegalTicketAddComponent,
        data,
        '',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalUpdateStatus(data: any) {
    this.dialogHandlerService
      .openDialog(
        LegalTicketUpdateStatusComponent,
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

  onModalSeguimiento(data: any) {
    this.dialogHandlerService
      .openDialog(
        TicketTrakingComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalViewDetail(data: any) {
    this.dialogHandlerService.openDialog(
      TicketTrakingRequestDetailComponent,
      data,
      '',
      this.dialogHandlerService.dialogSizeMd
    );
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`TicketLegal/${id}`)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  // PendingEmail() {
  //   const urlApi = `TicketLegal/PendingEmail`;
  //   this.apiRequestService.onGetItem(urlApi);
  // }
}
