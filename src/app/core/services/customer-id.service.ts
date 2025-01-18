// Importaciones necesarias para el servicio
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from './auth.service';
import { DataConnectorService } from './data.service';
import { StorageService } from './storage.service';

/**
 * Servicio para gestionar la información del cliente actual.
 * Permite obtener y almacenar el ID del cliente, su nombre y su foto.
 */
@Injectable({
  providedIn: 'root',
})
export class CustomerIdService implements OnDestroy {
  // Inyección de dependencias necesarias
  dataService = inject(DataConnectorService); // Servicio para realizar peticiones HTTP
  private storageService = inject(StorageService); // Servicio para manejar almacenamiento local

  private destroy$ = new Subject<void>(); // Utilizado para limpiar suscripciones cuando el servicio se destruye

  // Propiedades públicas para almacenar datos del cliente
  nameCustomer: string = ''; // Nombre del cliente
  photoPath: string = ''; // Ruta de la foto del cliente
  customerId: number = 0; // ID del cliente (valor predeterminado)

  private customerId$ = new Subject<number>(); // Observable para emitir cambios en el ID del cliente

  /**
   * Constructor del servicio.
   * Intenta inicializar el ID del cliente desde el almacenamiento o desde el token del usuario.
   * @param authS Servicio de autenticación para acceder al token del usuario.
   */
  constructor(public authS: AuthService) {
    // Verifica si existe un token en el servicio de autenticación
    if (this.authS.userTokenDto) {
      // Si no existe un customerId en el almacenamiento local, lo establece desde el token
      if (
        this.storageService.retrieve('customerId') === null ||
        this.storageService.retrieve('customerId') === undefined
      ) {
        this.storageService.store(
          'customerId',
          this.authS.userTokenDto.infoUserAuthDto.customerId
        );
        this.customerId = this.authS.userTokenDto.infoUserAuthDto.customerId;
      } else {
        // Si ya existe, lo recupera del almacenamiento local
        this.customerId = this.storageService.retrieve('customerId');
      }
    }

    // Carga los datos del cliente basado en el ID obtenido
    this.onLoadDataCustomer(this.customerId);
  }

  /**
   * Establece un nuevo ID de cliente y carga sus datos.
   * @param customerId El nuevo ID del cliente.
   */
  setCustomerId(customerId: number) {
    this.storageService.store('customerId', customerId); // Almacena el ID del cliente en el almacenamiento local
    this.customerId = customerId; // Actualiza la propiedad local
    this.customerId$.next(customerId); // Notifica a los observadores del cambio
    this.onLoadDataCustomer(customerId); // Carga los datos del cliente
  }

  /**
   * Retorna un observable que emite el ID del cliente cada vez que cambia.
   * @returns Observable que emite el ID del cliente.
   */
  getCustomerId$(): Observable<number> {
    return this.customerId$.asObservable();
  }

  /**
   * Retorna el valor actual del ID del cliente.
   * @returns ID del cliente.
   */
  getCustomerId() {
    return this.customerId;
  }

  /**
   * Carga los datos del cliente desde el servidor.
   * @param customerId ID del cliente a cargar.
   */
  onLoadDataCustomer(customerId: number) {
    this.dataService
      .get(`Customers/${customerId}`) // Realiza la petición HTTP
      .pipe(takeUntil(this.destroy$)) // Gestiona la suscripción para evitar fugas de memoria
      .subscribe({
        next: (resp: any) => {
          this.nameCustomer = resp.body.nombreCorto; // Asigna el nombre del cliente
          this.photoPath = resp.body.photoPath; // Asigna la ruta de la foto del cliente
          this.customerId = resp.body.id; // Asigna el ID del cliente

          // Notifica a los observadores del cambio en los datos del cliente
          this.customerId$.next(customerId);
        },
        error: (error) => {
          console.error(error.error); // Maneja errores en la petición
        },
      });
  }

  /**
   * Se ejecuta cuando el servicio se destruye.
   * Limpia todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroy$.next(); // Finaliza las suscripciones
    this.destroy$.complete(); // Limpia el Subject
  }
}
