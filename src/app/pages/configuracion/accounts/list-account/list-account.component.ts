import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbDropdownModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { IAccountDto } from 'src/app/core/interfaces/account-dto.interface';
import PhoneFormatPipe from 'src/app/core/pipes/phone-format.pipe';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import ComponentsModule from 'src/app/shared/components.module';
import DropdownRouteComponent from 'src/app/shared/ngb-dropdown-menu/dropdown-route.component';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import CreateAccountComponent from '../create-account/create-account.component';
import AddOrEditEmailDataComponent from '../email-data/addoredit-email-data.component';
import MdEditAccountComponent from '../modal-edit-account/md-edit-account.component';
@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    PrimeNgModule,
    NgbDropdownModule,
    DropdownRouteComponent,
    PhoneFormatPipe,
    NgbTooltip,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListAccountComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);

  cb_customer: ISelectItemDto[] = [];
  cb_profession: ISelectItemDto[] = [];
  data: IAccountDto[] = [];
  applicationUserId: string = '';
  employeeId: number = 0;
  ref: DynamicDialogRef;
  state: boolean = true;
  title: string = '';
  urlImgApi = environment.base_urlImg + 'Administration/accounts/';

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
  }
  onCardEmployee(employeeId: number) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId,
      },
      header: 'Colaborador',
      styleClass: 'modal-sm',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  onCreateAccount() {
    this.ref = this.dialogService.open(CreateAccountComponent, {
      header: 'Crear Cuenta',
      styleClass: 'modal-sm',
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
  onModalEmailData(applicationUserId: string) {
    this.ref = this.dialogService.open(AddOrEditEmailDataComponent, {
      data: {
        applicationUserId: applicationUserId,
      },
      header: 'Datos de Correo',
      styleClass: 'shadow-lg modal-md',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalEditAccount(applicationUserId: string, email: string) {
    this.ref = this.dialogService.open(MdEditAccountComponent, {
      data: {
        applicationUserId: applicationUserId,
        email: email,
      },
      header: 'Editar Cuenta',
      width: '100%',
      height: '100%',
      styleClass: 'shadow-lg',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      this.customToastService.onShowSuccess();
      this.onLoadData();
    });
  }

  onLoadData(): void {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get<IAccountDto[]>(`accounts/getall`)
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

  onToBlockAccount(applicationUserId: string): void {
    this.dataService
      .get('Accounts/ToBlockAccount/' + applicationUserId)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          const registro = this.data.find(
            (item) => item.id === applicationUserId
          );

          // Verifica si se encontró el registro
          if (registro) {
            // Modifica la propiedad 'active'
            registro.active = !registro.active; // o cualquier otro valor que desees asignar
          } else {
          }
          this.customToastService.onShowSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onToUnlockAccount(applicationUserId: string): void {
    this.dataService
      .get('Accounts/ToUnlockAccount/' + applicationUserId)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          // this.onLoadData();
          // Encuentra el registro por su 'id'
          const registro = this.data.find(
            (item) => item.id === applicationUserId
          );

          // Verifica si se encontró el registro
          if (registro) {
            // Modifica la propiedad 'active'
            registro.active = !registro.active; // o cualquier otro valor que desees asignar
          }
          this.customToastService.onShowSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onDelete(applicationUserId: string): void {
    this.dataService
      .delete('Accounts/' + applicationUserId)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
