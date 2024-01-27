import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-addoredit-periodo-cedula',
  templateUrl: './addoredit-periodo-cedula.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class AddoreditPeriodoCedulaPresupuestalComponent
  implements OnInit, OnDestroy
{
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  private formBuilder = inject(FormBuilder);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  id: number = 0;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    desde: ['', Validators.required],
    hasta: ['', Validators.required],
    employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
    customerId: [],
  });

  ngOnInit() {
    this.id = this.config.data.cedulaId;
    this.onLoadItem();
  }
  onLoadItem() {
    this.dataService
      .get<any>(`CedulaPresupuestal/GetCedulaPresuppuestal/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
      });
  }
  onSubmit() {
    const cedulaDto: any = this.form.value;
    if (!this.dataService.validateForm(this.form)) return;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post(`CedulaPresupuestal`, cedulaDto)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(`CedulaPresupuestal/Actualizar/${this.id}`, cedulaDto)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
