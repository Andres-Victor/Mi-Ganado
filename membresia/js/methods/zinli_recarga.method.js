/* ============================================================
   Mi Ganado PRO — Método de pago: Recarga Zinli (tarjeta)
   js/methods/zinli_recarga.method.js
   ============================================================ */

import { PaymentMethod } from './methods_payment_method.js';

export class ZinliRecargaMethod extends PaymentMethod
{
  constructor()
  {
    super
    (
      {
        key: 'zinli-recarga',
        category: 'card',
        name: 'Recarga Zinli',
        theme: 'theme-zinli',
        badge:
        {
          icon: 'i-zap',
          text: 'Instantáneo · Tarjeta',
        },
        desc: 'Pago instantáneo con tu tarjeta de débito o crédito a través de Zinli.',
        logo:
        {
          img: './res/img/zinli.png',
          fallback: 'Z|#4F46E5',
        },
        instructions:
        [
          'Toca el botón "Pagar con tarjeta" para abrir el portal de pagos de Zinli.',
          'Proporciona los datos solicitados por el portal.',
          'Escribe el monto exacto que aparece en el resumen y continúa.',
          'Guarda/captura el comprobante al finalizar.',
        ],
        dataTitle: 'Datos de Zinli',
        dataRows: [],
        action:
        {
          label: 'Pagar con tarjeta',
          caption: 'recargas.zinli.com',
          buildLink:
          () =>
          {
            return 'https://recargas.zinli.com/4Tw3uz4jKjAdrnttipYSW2';
          },
        },
        formFields: 
        [
          'miGanadoEmail',
          'receipt',
        ],
        chargesInUsd: true,
        noRefoundsReason: 'La recarga se abona al instante en la cuenta de destino y Zinli no permite revertirla.',
        serviceComission: '4% a 6%',
      }
    );
  }
}
