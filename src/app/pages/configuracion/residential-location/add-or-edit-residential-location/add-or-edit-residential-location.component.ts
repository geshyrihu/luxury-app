import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-or-edit-residential-location',
  templateUrl: './add-or-edit-residential-location.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditResidentialLocationComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: number = 0;
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    location: ['', Validators.required],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `residentiallocation/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`residentiallocation`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`residentiallocation/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
