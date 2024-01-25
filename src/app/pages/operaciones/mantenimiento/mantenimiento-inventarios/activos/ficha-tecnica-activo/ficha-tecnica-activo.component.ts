import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IFichaTecnicaActivoDto } from 'src/app/core/interfaces/IFichaTecnicaActivoDto.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ficha-tecnica-activo',
  templateUrl: './ficha-tecnica-activo.component.html',
  standalone: true,
  imports: [NgbAlert, CommonModule],
  providers: [CustomToastService],
})
export default class FichaTecnicaActivoComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);

  urlImgBase: string = environment.base_urlImg;
  data: IFichaTecnicaActivoDto;
  id: number = 0;
  subRef$: Subscription;

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get<IFichaTecnicaActivoDto>(`Machineries/Fichatecnica/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
