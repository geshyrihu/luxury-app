import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-propiedades-addoredit',
  templateUrl: './propiedades-addoredit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class PropiedadesAddOrEditComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  custIdService = inject(CustomerIdService);

  submitting: boolean = false;

  id: number = 0;
  customerId: number = this.custIdService.customerId;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    department: ['', Validators.required],
    customerId: [this.customerId, Validators.required],
    tower: ['', Validators.required],
    user: [''],
    applicationUserId: [this.authS.applicationUserId],
  });

  ngOnInit(): void {
    this.customerId = this.custIdService.customerId;
    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.onLoadData();
    }
  }
  submit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`DirectoryCondominium`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`DirectoryCondominium/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  onLoadData() {
    this.apiRequestService
      .onGetItem(`DirectoryCondominium/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }
}
