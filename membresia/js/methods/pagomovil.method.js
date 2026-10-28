/* ============================================================
   Mi Ganado PRO — Método de pago: PagoMóvil (Venezuela)
   js/methods/pagomovil.method.js
   ============================================================ */

import { PaymentMethod } from './methods_payment_method.js';

export class PagomovilMethod extends PaymentMethod
{
  constructor()
  {
    super
    (
      {
        key: 'pagomovil',
        category: 'local',
        name: 'PagoMóvil',
        theme: 'theme-pagomovil',
        badge:
        {
          icon: 'i-clock',
          text: 'En minutos',
        },
        desc: 'Transferencia desde cualquier banco venezolano. Sin comisión adicional.',
        logo:
        {
          icon: 'i-phone',
        },
        instructions:
        [
          'Abre la app de tu banco y selecciona la opción "Pago Móvil".',
          'Registra los datos del comercio y el monto exacto de tu plan.',
          'Guarda el recibo con el número de operación del banco.',
        ],
        dataTitle: 'Datos PagoMóvil',
        dataRows:
        [
          { label: 'Banco', value: 'Banco Mercantil' },
          { label: 'Cédula', value: '31.754.601' },
          { label: 'Teléfono', value: '04144746323' },
        ],
        action: null,
        formFields:
        [
          'miGanadoEmail',
          'referenceCode',
          'receipt',
        ],
        chargesInUsd: false,
        customRefoundReason: 'Se puede devolver el monto con un PagoMóvil a la misma cuenta desde la que pagaste. No se asegura que el monto final sea exactamente el mismo.',
      }
    );
  }
}
