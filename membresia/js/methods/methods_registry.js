/* ============================================================
   Mi Ganado PRO — Métodos de pago: registro
   js/methods/methods_registry.js
   ------------------------------------------------------------
   Registro central de métodos. Las categorías del paso 2 y sus
   servicios se derivan del registro: nunca se escriben a mano.
   ============================================================ */

import { PaymentMethod } from './methods_payment_method.js';

const CATEGORY_META =
{
  local: { name: 'Moneda Local (Venezuela)', order: 1 },
  card: { name: 'Tarjeta de Crédito o Débito', order: 2 },
  wallet: { name: 'Billetera Electrónica', order: 3 },
  crypto: { name: 'Criptomonedas', order: 4 },
};

const _methods = new Map();

export function registerPaymentMethod(method)
{
  if (!(method instanceof PaymentMethod))
  {
    throw new Error('registerPaymentMethod: se esperaba una instancia de PaymentMethod');
  }

  if (!_methods.has(method.category))
  {
    _methods.set(method.category, []);
  }

  _methods.get(method.category).push(method);
}

export function registerPaymentMethods(methods)
{
  methods.forEach
  (
    (method) =>
    {
      registerPaymentMethod(method);
    }
  );
}

export function getPaymentMethod(methodKey)
{
  let found = null;

  _methods.forEach
  (
    (list) =>
    {
      const match = list.find
      (
        (method) =>
        {
          return method.key === methodKey;
        }
      );

      if (match) found = match;
    }
  );

  return found;
}

export function listMethodsByCategory(categoryKey)
{
  return _methods.get(categoryKey) || [];
}

export function listAllMethods()
{
  const result = [];

  _methods.forEach
  (
    (list) =>
    {
      list.forEach
      (
        (method) =>
        {
          result.push(method);
        }
      );
    }
  );

  return result;
}

export function listMethodThemes()
{
  const themes = [];

  listAllMethods().forEach
  (
    (method) =>
    {
      if (method.theme && !themes.includes(method.theme)) themes.push(method.theme);
    }
  );

  return themes;
}

export function isKnownCategory(categoryKey)
{
  return Object.prototype.hasOwnProperty.call(CATEGORY_META, categoryKey);
}

export function getCategoryName(categoryKey)
{
  if (!isKnownCategory(categoryKey)) return '';

  return CATEGORY_META[categoryKey].name;
}

// La lista completa de categorías sigue el orden del registro,
// pero solo se exponen las que tienen metas definidas.
export function listCategoryKeys()
{
  const keys = Object.keys(CATEGORY_META);

  keys.sort
  (
    (a, b) =>
    {
      return CATEGORY_META[a].order - CATEGORY_META[b].order;
    }
  );

  return keys;
}
