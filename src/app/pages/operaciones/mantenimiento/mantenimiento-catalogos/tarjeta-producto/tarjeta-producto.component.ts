import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tarjeta-producto',
  templateUrl: './tarjeta-producto.component.html',
  standalone: true,
  imports: [CommonModule],
})
export default class TarjetaProductoComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  productoId: number = 0;
  producto: any;
  urlImg: string = `${environment.base_urlImg}Administration/products/`;

  ngOnInit(): void {
    this.productoId = this.config.data.productoId;
    this.dataService
      .get(`Productos/${this.productoId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe((resp) => {
        this.producto = resp.body;
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
