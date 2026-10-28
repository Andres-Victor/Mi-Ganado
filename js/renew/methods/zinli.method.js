/* ============================================================
   Mi Ganado PRO — Método de pago: Zinli (billetera)
   js/methods/zinli.method.js
   ============================================================ */

import { PaymentMethod } from './methods_payment_method.js';

export class ZinliMethod extends PaymentMethod
{
  constructor()
  {
    super
    (
      {
        key: 'zinli',
        category: 'wallet',
        name: 'Zinli',
        theme: 'theme-zinli',
        badge:
        {
          icon: 'i-zap',
          text: 'Instantáneo · USD',
        },
        desc: 'Envía el pago desde tu saldo Zinli de forma instantánea.',
        logo:
        {
          img: './res/img/zinli.png',
          fallback: 'Z|#4F46E5',
        },
        instructions:
        [
          'Abre la app de Zinli, pulsa "Enviar" y elige enviar de Zinli a Zinli.',
          'Escribe el correo vianvarela@gmail.com y confirma que el destinatario sea Victor Andres Varela Gonzalez.',
          'Envía el monto exacto de tu membresía y toma la captura del pago.',
        ],
        dataTitle: 'Datos del destinatario Zinli',
        dataRows:
        [
          { label: 'Titular', value: 'Victor Andres Varela Gonzalez' },
          { label: 'Correo Zinli', value: 'vianvarela@gmail.com' },
        ],
        action: null,
        formFields:
        [
          'miGanadoEmail',
          'receipt',
        ],
        chargesInUsd: true,
      }
    );
  }
}
