import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { IUseCFDIDto } from '../../../core/interfaces/IUseCfdi.interface';
import AddoreditUsoCFDIComponent from './addoredit-uso-cfdi.component';

@Component({
  selector: 'app-uso-cfdi',
  templateUrl: './list-uso-cfdi.component.html',
  standalone: true,
  imports: [ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListUsoCfdiComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  data: IUseCFDIDto[] = [];

  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.get<IUseCFDIDto[]>('UsoCfdi').subscribe({
      next: (resp: any) => {
        this.data = resp.body;
        this.customToastService.onClose();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }

  onDelete(dto: IUseCFDIDto) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService.delete(`UsoCfdi/${dto.id}`).subscribe({
      next: () => {
        this.onLoadData();
        this.customToastService.onCloseToSuccess();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditUsoCFDIComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
