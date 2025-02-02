import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-module-app-add-or-edit',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  templateUrl: './module-app-add-or-edit.component.html',
})
export class ModuleAppAddOrEditComponent {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  cb_pathParent: ISelectItem[] = [];
  id: string = '';
  submitting: boolean = false;
  cb_rolLevel: ISelectItem[] = onGetSelectItemFromEnum(ERolLevel);
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    nameModule: ['', [Validators.required]],
    rolLevel: [],
    label: [],
    routerLink: [],
    icon: [],
    pathParent: [],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();

    this.onLoadModuleApp();
  }
  onLoadData() {
    const urlApi = `ModuleApp/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestService
        .onPost(`ModuleApp`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`ModuleApp/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  onLoadModuleApp() {
    const urlApi = `ModuleApp`;
    this.apiRequestService.onGetSelectItem(urlApi).then((result: any) => {
      this.cb_pathParent = result;
    });
  }
}
export enum ERolLevel {
  SuperUser,
  Administrator,
}
