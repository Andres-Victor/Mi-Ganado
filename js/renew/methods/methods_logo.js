/* ============================================================
   Mi Ganado PRO — Métodos de pago: logos
   js/methods/methods_logo.js
   ------------------------------------------------------------
   Genera el HTML del logo de un método según su definición:
   imagen con respaldo, icono del sprite, logo de Binance o una
   inicial con color.
   ============================================================ */

const BINANCE_LOGO_SVG = `<svg class="payment-logo-svg" viewBox="0 0 26 26" aria-hidden="true"><g fill="#F3BA2F"><rect x="9" y="9" width="8" height="8" transform="rotate(45 13 13)"/><rect x="11.2" y="1.2" width="3.6" height="3.6" transform="rotate(45 13 3)"/><rect x="11.2" y="21.2" width="3.6" height="3.6" transform="rotate(45 13 23)"/><rect x="1.2" y="11.2" width="3.6" height="3.6" transform="rotate(45 3 13)"/><rect x="21.2" y="11.2" width="3.6" height="3.6" transform="rotate(45 23 13)"/></g></svg>`;

export function buildLogo(logo)
{
  if (!logo) return '';

  if (logo.img)
  {
    return `<img src="${logo.img}" alt="" data-fallback="${logo.fallback || '?|#5c7186'}">`;
  }

  if (logo.icon)
  {
    return `<svg class="icon icon-lg" aria-hidden="true"><use href="#${logo.icon}"/></svg>`;
  }

  if (logo.binance) return BINANCE_LOGO_SVG;

  if (logo.letter)
  {
    return `<div class="logo-fallback" style="background:${logo.color || '#5c7186'}">${logo.letter}</div>`;
  }

  return '';
}
