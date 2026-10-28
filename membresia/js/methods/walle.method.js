/* ============================================================
   Mi Ganado PRO — Método de pago: Wall-e
   js/methods/walle.method.js
   ------------------------------------------------------------
   Pendiente de datos de pago. Para habilitarlo: completa
   dataRows/action, pon comingSoon en false y listo.
   ============================================================ */

import { PaymentMethod } from './methods_payment_method.js';

export class WalleMethod extends PaymentMethod
{
  constructor()
  {
    super
    (
      {
        key: 'walle',
        category: 'wallet',
        name: 'Wall-e',
        theme: 'theme-walle',
        badge:
        {
          icon: 'i-clock',
          text: 'Próximamente',
        },
        desc: 'Método de pago en proceso de integración.',
        logo:
        {
          letter: 'W',
          color: '#64748B',
        },
        instructions: [],
        dataTitle: 'Datos de Wall-e',
        dataRows: 
        [
          { label: 'Correo', value: 'pagos@miganado.net' },
        ],
        action: null,
        formFields: [],
        chargesInUsd: false,
        comingSoon: false,
      }
    );
  }
}
