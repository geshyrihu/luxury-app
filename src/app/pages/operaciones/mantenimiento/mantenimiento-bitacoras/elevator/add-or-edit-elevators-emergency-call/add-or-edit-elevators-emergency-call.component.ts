import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-elevators-emergency-call',
  templateUrl: './add-or-edit-elevators-emergency-call.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [DatePipe],
})
export default class AddOrEditElevatorsEmergencyCallComponent
  implements OnInit
{
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  datePipe = inject(DatePipe);
  dateService = inject(DateService);

  ref = inject(DynamicDialogRef);
  cb_elevators: ISelectItem[] = [];

  id: string = '';
  customerId: number = 0;
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    folio: ['', Validators.required],
    customerId: [this.config.data.customerId, Validators.required],
    machineryId: ['', Validators.required],
    requestDate: ['', Validators.required],
    report: ['', Validators.required],
    request: [''],
    personWhoReports: ['', Validators.required],
    technicianWhoAttended: [''],
  });

  ngOnInit(): void {
    this.onLoadDataElevators();
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `ElevatorsEmergencyCall/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      const requestDate = this.dateService.getDateFormat(result.requestDate);
      result.requestDate = requestDate;
      this.form.patchValue(result);
    });
  }
  onLoadDataElevators() {
    const urlApi = `elevatorsparepartschange/elevators/${this.config.data.customerId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.cb_elevators = result;
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;
    // Convertir la fecha a formato ISO 8601 utilizando DatePipe
    const formattedDate = this.datePipe.transform(
      this.form.value.requestDate,
      'yyyy-MM-dd'
    );
    // Asignar la fecha convertida de nuevo al formulario
    this.form.value.requestDate = formattedDate;

    if (this.id === '') {
      this.apiRequestService
        .onPost(`ElevatorsEmergencyCall`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`ElevatorsEmergencyCall/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
