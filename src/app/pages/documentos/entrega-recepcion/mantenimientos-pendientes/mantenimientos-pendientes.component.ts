import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mantenimientos-pendientes',
  templateUrl: './mantenimientos-pendientes.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class MantenimientosPendientesComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);

  data: any[] = [];

  customerId$: Observable<number> = this.custIdService.getCustomerId$();
  base_urlImg = environment.base_urlImg;

  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `'EntregaRecepcion/Pendientes/${this.custIdService.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  calcularEquiposTotal(name) {
    let total = 0;

    if (this.data) {
      for (let customer of this.data) {
        if (customer.clasificacion === name) {
          total++;
        }
      }
    }

    return total;
  }
}
