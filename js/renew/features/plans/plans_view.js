/* ============================================================
   Mi Ganado PRO — Feature: planes
   js/features/plans/plans_view.js
   ------------------------------------------------------------
   Pinta los precios de las dos tarjetas de plan. Las tarjetas
   ya no son seleccionables: solo el botón "Elegir" avanza.
   ============================================================ */

import { computePriceBreakdown, convertNumberToCurrency } from '../../core/core_currency.js';
import { setText } from '../../core/core_dom.js';

export function renderPlans()
{
  const breakdown = computePriceBreakdown();
  const rate = breakdown.rate;

  setText('monthlyPrice', `${rate.symbol} ${convertNumberToCurrency(breakdown.monthly)}`);
  setText('annualPrice', `${rate.symbol} ${convertNumberToCurrency(breakdown.annualEquivalent)}`);
  setText('annualBadge', `-${breakdown.discountPercent}%`);
  setText('annualPriceBefore', `${rate.symbol} ${convertNumberToCurrency(breakdown.monthly)}`);
  setText('annualSaved', `Ahorra ${rate.symbol} ${convertNumberToCurrency(breakdown.saved)}`);
  setText('finalPaymentAdvice', `Facturado anualmente como un único pago de ${rate.symbol} ${convertNumberToCurrency(breakdown.annual)}.`);
  setText('currencyTag', rate.label);
}
