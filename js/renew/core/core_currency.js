/* ============================================================
   Mi Ganado PRO — Núcleo: moneda y precios
   js/core/core_currency.js
   ------------------------------------------------------------
   Tasas por país, conversión con formato local y desglose de
   precios de la membresía.
   ============================================================ */

import { appState } from './core_state.js';

export const CURRENCY_RATES =
{
  US: { symbol: 'US$', rate: 1, label: 'USD', locale: 'en-US', rounded: false },
  CO: { symbol: 'COP$', rate: 3600, label: 'COP', locale: 'es-CO', rounded: true },
  MX: { symbol: 'MXN$', rate: 17, label: 'MXN', locale: 'es-MX', rounded: true },
  VE: { symbol: 'VES$', rate: 1000, label: 'VES', locale: 'es-VE', rounded: true },
};

export function hasCurrency(currencyCode)
{
  return Object.prototype.hasOwnProperty.call(CURRENCY_RATES, currencyCode);
}

export function getCurrencyConfig(currencyCode)
{
  const code = currencyCode === undefined ? appState.currency : currencyCode;

  if (hasCurrency(code)) return CURRENCY_RATES[code];

  return CURRENCY_RATES.US;
}

export function setCurrencyRate(currencyCode, rate)
{
  if (!hasCurrency(currencyCode)) return;

  const parsedRate = Number(rate);

  if (Number.isNaN(parsedRate)) return;

  CURRENCY_RATES[currencyCode].rate = parsedRate;
}

export function convertNumberToCurrency(number)
{
  // 1. Guardarraíl al principio
  if (typeof number !== 'number' && typeof number !== 'string')
  {
    return number;
  }

  const parsedInput = Number(number);

  if (Number.isNaN(parsedInput))
  {
    return number;
  }

  // 2. Configuración de la moneda actual
  const rate = getCurrencyConfig();
  const alwaysShowDecimals = rate.rounded !== true;

  // 3. Extracción exacta de unidades y centavos truncados
  const totalCents = Math.floor(parsedInput * 100);
  const unidades = Math.floor(totalCents / 100);
  const centavos = totalCents % 100;

  // 4. Formatear las unidades con el locale
  const unidadesFormateadas = unidades.toLocaleString
  (
    rate.locale,
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  );

  // 5. Retornar con o sin centavos según la moneda
  if (alwaysShowDecimals || centavos > 0)
  {
    const decimalSeparator = (1.1).toLocaleString(rate.locale).substring(1, 2);
    const centavosString = String(centavos).padStart(2, '0');

    return `${unidadesFormateadas}${decimalSeparator}${centavosString}`;
  }

  return unidadesFormateadas;
}

// Desglose completo de las tarjetas de plan
export function computePriceBreakdown()
{
  const rate = getCurrencyConfig();

  const monthlyConverted = Math.round(appState.prices.monthly * rate.rate * 100) / 100;
  const annualConverted = Math.round(appState.prices.annual * rate.rate * 100) / 100;

  let monthly = monthlyConverted;
  let annual = annualConverted;

  // En monedas redondeadas se ajusta al múltiplo de 10 más cercano
  if (rate.rounded)
  {
    monthly = Math.round(monthlyConverted / 10) * 10;
    annual = Math.round(annualConverted / 10) * 10;
  }

  const annualEquivalent = annual / 12;
  const saved = rate.rounded ? (monthly * 12) - annual : (monthlyConverted * 12) - annualConverted;
  const discountPercent = monthly === 0 ? 0 : Math.round((1 - (annualEquivalent / monthly)) * 100);

  return {
    rate,
    monthly,
    annual,
    annualEquivalent,
    saved,
    discountPercent,
  };
}

// Montos de la membresía elegida (usados por el resumen y el webhook)
export function computeMembershipAmounts()
{
  const breakdown = computePriceBreakdown();
  const isMonthly = appState.membership === 'monthly';

  return {
    rate: breakdown.rate,
    localAmount: isMonthly ? breakdown.monthly : breakdown.annual,
    usdAmount: isMonthly ? appState.prices.monthly : appState.prices.annual,
    periodText: isMonthly ? 'por este mes' : 'por este año',
    planName: isMonthly ? 'Mensual' : 'Anual',
  };
}
