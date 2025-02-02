import { Component } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-form-actas-entrega-equipos',
  templateUrl: './form-actas-entrega-equipos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class FormActasEntregaEquiposComponent {
  date: Date = new Date();
  empresaReceptora: string = '';
  entregadoPor: string = '';
  recibidoPor: string = '';

  constructor(public ref: DynamicDialogRef) {}

  onSendData() {
    this.ref.close({
      date: this.date,
      empresaReceptora: this.empresaReceptora,
      entregadoPor: this.entregadoPor,
      recibidoPor: this.recibidoPor,
    });
  }
}
