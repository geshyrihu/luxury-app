import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DateService } from 'src/app/core/services/date.service';
const date = new Date();

@Component({
  selector: 'app-form-medidor-lectura',
  templateUrl: './form-medidor-lectura.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class FormMedidorLecturaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  dateService = inject(DateService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  dateString: string = this.dateService.getDateFormat(date);
  dateStringUltimoRegistro: string = '';
  seRegistroEsteDia: boolean = false;
  seRegistroEsteDiaMensaje: string = 'Ya se cargo el registro de este día';
  id: number = 0;
  ultimaLectura: number = 0;
  medidorId: number = 0;
  cb_nombreMedidorCategoria: any[] = [];
  form: FormGroup;

  validarUltimaLectura() {
    if (this.dateString === this.dateStringUltimoRegistro) {
      this.seRegistroEsteDia = true;
    } else {
      this.seRegistroEsteDia = false;
    }
  }
  ngOnInit(): void {
    this.id = this.config.data.id;
    this.medidorId = this.config.data.medidorId;

    const urlApi = `MedidorLectura/UltimaLectura/${this.medidorId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      if (result !== null) {
        this.dateStringUltimoRegistro = this.dateService.getDateFormat(
          result.fechaRegistro
        );
        this.validarUltimaLectura();
        this.ultimaLectura = result.lectura;
      }
    });

    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      medidorId: [this.medidorId],
      fechaRegistro: [''],
      lectura: ['', Validators.required],
      applicationUserId: [this.authS.applicationUserId],
    });
  }
  onLoadData() {
    const urlApi = `MedidorLectura/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (this.form.value.lectura == 0) return;
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`MedidorLectura`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`MedidorLectura/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  laLecturaEsMenor = false;
  evaluarLectura(event: any) {
    if (
      event.target.value < Number(this.ultimaLectura) &&
      this.ultimaLectura !== 0
    ) {
      this.laLecturaEsMenor = true;
    } else {
      this.laLecturaEsMenor = false;
    }
  }

  get f() {
    return this.form.controls;
  }
}
