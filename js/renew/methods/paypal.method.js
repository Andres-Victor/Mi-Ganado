/* ============================================================
   Mi Ganado PRO — Método de pago: PayPal
   js/methods/paypal.method.js
   ============================================================ */

import { PaymentMethod } from './methods_payment_method.js';

export class PaypalMethod extends PaymentMethod
{
  constructor()
  {
    super
    (
      {
        key: 'paypal',
        category: 'wallet',
        name: 'PayPal',
        theme: 'theme-paypal',
        badge:
        {
          icon: 'i-globe',
          text: 'Reembolso seguro',
        },
        desc: 'Saldo de PayPal o tarjetas internacionales Visa, Mastercard y AMEX. Incluye protección al comprador.',
        logo:
        {
          img: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/PayPal_Logo_Icon_2014.svg',
          fallback: 'P|#003087',
        },
        instructions:
        [
          'Toca el botón "Pagar con PayPal" para abrir el enlace con el monto exacto. O busca el usuario en la aplicación.',
          'Inicia sesión con tu cuenta y confirma el envío del dinero al usuario de PayPal.',
          // 'Guarda el recibo: PayPal también te lo enviará por correo electrónico.',
        ],
        dataTitle: 'Datos de PayPal',
        dataRows: 
        [
          { label: 'Usuario de Paypal', value: '@MiGanado' },
        ],
        action:
        {
          label: 'Pagar con PayPal',
          caption: 'paypal.me/miganado',
          buildLink:
          (amount) =>
          {
            return `https://paypal.me/miganado/${amount}`;
          },
        },
        formFields:
        [
          'miGanadoEmail',
          'emisorEmail',
        ],
        chargesInUsd: false,
      }
    );
  }
}
