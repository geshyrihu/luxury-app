import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';

@Component({
  selector: 'app-addoredit-salidas',
  templateUrl: './addoredit-salidas.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class CrudSalidasComponent implements OnInit, OnDestroy {
  private customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  private dateService = inject(DateService);
  private formBuilder = inject(FormBuilder);
  private selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  form: FormGroup;
  id = 0;
  idProducto = 0;
  nombreProducto = '';
  cantidadActual = 0;
  contidadSeleccionada: number = 0;
  cb_productos: any[] = [];
  cb_measurement_unit: any[] = [];
  existenciaActual: 0;
  dateTodat = new Date();
  noHaystock = '';

  ngOnInit(): void {
    flatpickrFactory();
    this.selectItemService
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_measurement_unit = resp;
      });

    this.dataService
      .get(
        `InventarioProducto/GetExistenciaProducto/${this.customerIdService.customerId}/${this.config.data.idProducto}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          if (resp.body !== null) {
            this.existenciaActual = resp.body.existencia;
          }
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
    // ...para obtener la cantidad actual de producto existentes
    this.id = this.config.data.id;

    this.nombreProducto = this.config.data.nombreProducto;
    this.idProducto = this.config.data.idProducto;

    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: 0, disabled: true },
      customerId: [this.customerIdService.customerId, Validators.required],
      fechaSalida: [this.dateService.getDateNow(), Validators.required],
      productoId: [this.idProducto, Validators.required],
      cantidad: [0, Validators.required],
      unidadMedidaId: ['', Validators.required],
      usoPrducto: ['', Validators.required],
      quienUso: ['', Validators.required],
      horaSalida: [
        `${this.dateTodat.getHours()}:${this.dateTodat.getMinutes()}`,
        Validators.required,
      ],
      employeeId: [
        this.authService.userTokenDto.infoEmployeeDto.employeeId,
        Validators.required,
      ],
    });
  }
  // convenience getter for easy access to form fields

  get f() {
    return this.form.controls;
  }
  onLoadData() {
    this.dataService
      .get(`SalidaProductos/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.nombreProducto = resp.body.producto;
          this.cantidadActual = resp.body.cantidad;
          resp.body.fechaSalida = this.dateService.getDateFormat(
            resp.body.fechaSalida
          );
          this.form.patchValue(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit() {
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post('SalidaProductos', this.form.value)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(
          `SalidaProductos/${this.id}/${this.cantidadActual}`,
          this.form.value
        )
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
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
