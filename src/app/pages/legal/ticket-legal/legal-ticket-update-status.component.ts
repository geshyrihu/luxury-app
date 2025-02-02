import { Component, OnInit, inject } from "@angular/core";
import LuxuryAppComponentsModule from "app/shared/luxuryapp-components.module";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { EStatus } from "src/app/core/enums/status.enum";
import { ApiRequestService } from "src/app/core/services/api-request.service";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-legal-ticket-update-status",
  templateUrl: "./legal-ticket-update-status.component.html",
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalTicketUpdateStatusComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  public auhtService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  loading = false;
  status: EStatus = 0;
  id = this.config.data.id;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(`TicketLegal/status/${this.id}`)
      .then((result: any) => {
        this.status = result.status;
      });
  }
  onSubmit() {
    this.apiRequestService
      .onGetItem(`TicketLegal/UpdateStatus/${this.id}/${this.status}`)
      .then((result: any) => {
        if (result) {
          this.ref.close(true);
        }
      });
  }
}
