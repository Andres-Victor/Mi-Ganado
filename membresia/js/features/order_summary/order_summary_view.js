/* ============================================================
   Mi Ganado PRO — Feature: resumen del pedido
   js/features/order_summary/order_summary_view.js
   ------------------------------------------------------------
   Pinta el bloque "Total a Pagar" de los pasos 4 y 5.
   Si el método cobra en dólares, el total se muestra en US$;
   si cobra en moneda local, se muestra en la moneda detectada.
   ============================================================ */

import { appState } from '../../core/core_state.js';
import { computeMembershipAmounts, convertNumberToCurrency } from '../../core/core_currency.js';
import { copyToClipboard, getElements, setTextAll } from '../../core/core_dom.js';
import { getPaymentMethod } from '../../methods/methods_registry.js';

function resolveChargesInUsd()
{
  if (!appState.serviceKey) return false;

  const method = getPaymentMethod(appState.serviceKey);

  if (!method) return false;

  return method.chargesInUsd;
}

function buildEquivalentText(chargesInUsd, usdFinal, rate)
{
  if (chargesInUsd)
  {
    if (appState.currency === 'VE')
    {
      const bolivares = Math.round(usdFinal * rate.rate / 10) * 10;

      return `≈ Bs. ${convertNumberToCurrency(bolivares)}`;
    }

    if (appState.currency !== 'US' && appState.currency !== null)
    {
      const local = Math.round(usdFinal * rate.rate * 100) / 100;

      return `≈ ${rate.symbol} ${convertNumberToCurrency(local)}`;
    }

    return '';
  }

  return `≈ US$ ${usdFinal.toFixed(2)}`;
}

function bindCopyButtons(copyValue)
{
  getElements('.js-price-copy').forEach
  (
    (button) =>
    {
      button.onclick = () =>
      {
        copyToClipboard(copyValue, button);
      };
    }
  );
}

export function renderOrderSummary()
{
  if (appState.membership !== 'monthly' && appState.membership !== 'annual') return;

  const amounts = computeMembershipAmounts();
  const rate = amounts.rate;
  const chargesInUsd = resolveChargesInUsd();

  const localFinal = Math.round(amounts.localAmount * 100) / 100;
  const usdFinal = Math.round(amounts.usdAmount * 100) / 100;

  const totalText = chargesInUsd
    ? `US$ ${usdFinal.toFixed(2)}`
    : `${rate.symbol} ${convertNumberToCurrency(localFinal)}`;

  setTextAll('.js-total-price', totalText);
  setTextAll('.js-price-period', amounts.periodText);
  setTextAll('.js-plan-name', amounts.planName);
  setTextAll('.js-method-name', appState.serviceName || 'No seleccionado');
  setTextAll('.js-equivalent-line', buildEquivalentText(chargesInUsd, usdFinal, rate));

  // Se copia exactamente lo que el usuario ve, sin el símbolo de moneda
  const copyValue = chargesInUsd
    ? usdFinal.toFixed(2)
    : String(convertNumberToCurrency(localFinal));

  bindCopyButtons(copyValue);
}
