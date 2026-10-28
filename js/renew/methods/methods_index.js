/* ============================================================
   Mi Ganado PRO — Métodos de pago: índice
   js/methods/methods_index.js
   ------------------------------------------------------------
   ÚNICO archivo a tocar al añadir un método de pago:
     1. Crear js/methods/<nombre>.method.js
     2. Importarlo aquí y agregarlo al arreglo.
   El orden del arreglo define el orden en pantalla.
   ============================================================ */

import { registerPaymentMethods } from './methods_registry.js';
import { PaypalMethod } from './paypal.method.js';
import { ZinliMethod } from './zinli.method.js';
import { WalleMethod } from './walle.method.js';
import { BinanceMethod } from './binance.method.js';
import { ZinliRecargaMethod } from './zinli_recarga.method.js';
import { PagomovilMethod } from './pagomovil.method.js';

export function registerAllPaymentMethods()
{
  registerPaymentMethods
  (
    [
      new PaypalMethod(),
      new ZinliMethod(),
      // new WalleMethod(),
      new BinanceMethod(),
      new ZinliRecargaMethod(),
      new PagomovilMethod(),
    ]
  );
}
