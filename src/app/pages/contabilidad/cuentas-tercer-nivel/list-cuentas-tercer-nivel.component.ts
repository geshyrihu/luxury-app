import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddoreditLedgerAccountsComponent from './addoredit-cuentas-tercer-nivel.component';

@Component({
  selector: 'app-list-cuentas-tercer-nivel',
  templateUrl: './list-cuentas-tercer-nivel.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListCuentasTercerNivelComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public authService = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  state: boolean = true;

  ngOnInit(): void {
    this.onLoadData(this.state);
  }

  onLoadData(state: boolean) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.state = state;
    this.dataService
      .get('Cuentas/GetList/' + (state ? 0 : 1))
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

  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`Cuentas/${data.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
          this.onLoadData(this.state);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditLedgerAccountsComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      height: 'auto',
      styleClass: 'modal-md',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData(this.state);
      }
    });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }

  organizeData(rawData: any[]): any[] {
    const organizedData = [];

    for (const rawItem of rawData) {
      // Nivel 1: Cuenta de primer nivel
      const nivel1Item = {
        idCuentaPrimerNivel: rawItem.idCuentaPrimerNivel,
        numeroCuentaPrimerNivel: rawItem.numeroCuentaPrimerNivel,
        descripcionPrimerNivel: rawItem.descripcionPrimerNivel,
        subNiveles: [],
      };

      // Nivel 2: Cuenta de segundo nivel
      const nivel2Item = {
        idCuentaSegundoNivel: rawItem.idCuentaSegundoNivel,
        numeroCuentaSegundoNivel: rawItem.numeroCuentaSegundoNivel,
        descripcionSegundoNivel: rawItem.descripcionSegundoNivel,
        subNiveles: [],
      };

      // Nivel 3: Cuenta de tercer nivel
      const nivel3Item = {
        idCuentaTercerNivel: rawItem.idCuentaTercerNivel,
        numeroCuentaTercerNivel: rawItem.numeroCuentaTercerNivel,
        descripcionTercerNivel: rawItem.descripcionTercerNivel,
      };

      // Agregar nivel 3 al nivel 2
      nivel2Item.subNiveles.push(nivel3Item);

      // Buscar si el nivel 1 ya existe en la estructura
      const nivel1Index = organizedData.findIndex(
        (item) => item.idCuentaPrimerNivel === nivel1Item.idCuentaPrimerNivel
      );

      if (nivel1Index !== -1) {
        // Nivel 1 ya existe, agregar nivel 2
        organizedData[nivel1Index].subNiveles.push(nivel2Item);
      } else {
        // Nivel 1 no existe, agregarlo con nivel 2
        nivel1Item.subNiveles.push(nivel2Item);
        organizedData.push(nivel1Item);
      }
    }

    return organizedData;
  }
}
