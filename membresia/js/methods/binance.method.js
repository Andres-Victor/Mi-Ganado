/* ============================================================
   Mi Ganado PRO — Método de pago: Binance Pay
   js/methods/binance.method.js
   ============================================================ */

import { PaymentMethod } from './methods_payment_method.js';

const BINANCE_LOGO =
{
  binance: true,
};

export class BinanceMethod extends PaymentMethod
{
  constructor()
  {
    super
    (
      {
        key: 'binance',
        category: 'crypto',
        name: 'Binance Pay',
        theme: 'theme-binance',
        badge:
        {
          icon: 'i-percent',
          text: 'Cero comisión',
        },
        desc: 'Transferencia instantánea de USDT vía Binance Pay ID o correo verificado, con confirmación en blockchain.',
        logo: BINANCE_LOGO,
        instructions:
        [
          'Abre la app de Binance y entra en la sección Pay → Enviar.',
          'Envía el monto exacto en USDT al UID o al correo que te indicamos.',
          // 'Guarda el ID de la transacción o una captura como comprobante.',
        ],
        dataTitle: 'Datos de Binance',
        dataRows:
        [
          { label: 'UID', value: '804746784' },
          { label: 'Correo', value: 'vianvarela@gmail.com' },
          { label: 'Moneda', value: 'Tether USD (USDT)' },
        ],
        action: null,
        formFields:
        [
          'miGanadoEmail',
          'emisorEmail',
        ],
        chargesInUsd: true,
        noRefoundsReason: 'Las transferencias de USDT quedan confirmadas en la blockchain y no pueden revertirse. Verifica el UID y el monto antes de enviar.',
      }
    );
  }
}
