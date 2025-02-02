import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
  selector: 'app-reporte-ordenes-servicio',
  templateUrl: './reporte-ordenes-servicio.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReporteOrdenesServicioComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);
  dateService = inject(DateService);
  periodoMonthService = inject(PeriodoMonthService);

  data: any[] = [];

  fecha: string = '';
  dataCustomer: any;
  nameCarpetaFecha: string = '';
  logoCustomer = '';
  nameCustomer = '';

  ngOnInit(): void {
    this.onLoadData();
    this.onLoadDataCustomer();
  }
  //TODO: Centralizar obtener ifno de customer...
  onLoadDataCustomer() {
    const urlApi = 'Customers/' + this.custIdService.customerId;

    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.dataCustomer = result;
      this.nameCustomer = result.nameCustomer;
      this.logoCustomer = result.photoPath;
    });
  }

  onLoadData() {
    const customerId = this.custIdService.customerId;
    const periodo = `${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}-01`;
    const urlApi = `ServiceOrders/ReporteOrdenesServicio/${customerId}/${periodo}`;

    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.data = result;
      this.nameCarpetaFecha = this.data[0].nameFolder;
    });
  }
}
