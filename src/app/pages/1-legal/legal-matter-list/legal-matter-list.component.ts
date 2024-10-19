import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import LegalMatterCategoryComponent from '../legal-matter-add-or-edit/legal-matter-add-or-edit.component';
import LegalMatterCategorieAddOrEditComponent from '../legal-matter-categorie-add-or-edit/legal-matter-categorie-add-or-edit.component';

@Component({
  selector: 'app-legal-matter-list',
  templateUrl: './legal-matter-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalMatterComponent {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  // Declaración e inicialización de variables
  data: any[];

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `LegalMatter`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`LegalMatter/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        LegalMatterCategoryComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalEditCategorie(data: any) {
    this.dialogHandlerService
      .openDialog(
        LegalMatterCategorieAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onDeleteCategorie(id: string) {
    const urlApi = `LegalMatter/Category/${id}`;
    this.apiRequestService.onDelete(urlApi).then((result: any) => {
      this.onLoadData();
    });
  }
}
