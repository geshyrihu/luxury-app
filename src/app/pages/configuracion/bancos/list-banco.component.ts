import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBankDto } from 'src/app/core/interfaces/IBankDto.interface';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import {
  DialogHandlerService,
  DialogSize,
} from 'src/app/core/services/dialog-handler.service';
import { OnDestroyService } from 'src/app/core/services/on-destroy.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditBancoComponent from './addoredit-banco.component';

@Component({
  selector: 'app-banco',
  templateUrl: './list-banco.component.html',
  standalone: true,
  imports: [ComponentsModule, PrimeNgModule],
  providers: [
    DialogService,
    MessageService,
    DialogHandlerService,
    CustomToastService,
  ],
})
export default class ListBancoComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public OnDestroy = inject(OnDestroyService);
  public dialogHandlerService = inject(DialogHandlerService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  // Declaración e inicialización de variables
  data: IBankDto[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  // Función para cargar los datos de los bancos
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    // Realizar una solicitud HTTP para obtener datos de bancos
    this.dataService
      .get<IBankDto[]>('Banks')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  // Función para eliminar un banco
  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    // Realizar una solicitud HTTP para eliminar un banco específico
    this.dataService
      .delete(`Banks/${data.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y volver a cargar los datos
          this.customToastService.onCloseToSuccess();
          this.onLoadData();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(AddOrEditBancoComponent, data, data.title, DialogSize.md)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  // Destruir componente
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
