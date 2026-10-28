/* ============================================================
   Mi Ganado PRO — Núcleo: estado de la aplicación
   js/core/core_state.js
   ------------------------------------------------------------
   Equivalente JS del ChangeNotifier: un único store con
   suscripción. Las vistas se pintan desde aquí, no hay
   variables globales dispersas.
   ============================================================ */

import { CORE_CONFIG } from './core_config.js';

export class AppState
{
  constructor()
  {
    this._listeners = new Set();

    this._data =
    {
      membership: null,       // 'monthly' | 'annual'
      paymentCategory: null,  // 'wallet' | 'crypto' | 'card' | 'local'
      serviceKey: null,       // clave del método registrado
      serviceName: null,      // nombre visible del método elegido
      currency: null,
      prices:
      {
        monthly: CORE_CONFIG.prices.monthly,
        annual: CORE_CONFIG.prices.annual,
      },
    };
  }

  get data()
  {
    return this._data;
  }

  get membership()
  {
    return this._data.membership;
  }

  get paymentCategory()
  {
    return this._data.paymentCategory;
  }

  get serviceKey()
  {
    return this._data.serviceKey;
  }

  get serviceName()
  {
    return this._data.serviceName;
  }

  get currency()
  {
    return this._data.currency;
  }

  get prices()
  {
    return this._data.prices;
  }

  update(patch)
  {
    this._data = Object.assign
    (
      {},
      this._data,
      patch,
    );

    this._notify();
  }

  subscribe(listener)
  {
    this._listeners.add(listener);

    return () =>
    {
      this._listeners.delete(listener);
    };
  }

  _notify()
  {
    this._listeners.forEach
    (
      (listener) =>
      {
        listener(this._data);
      }
    );
  }
}

export const appState = new AppState();
