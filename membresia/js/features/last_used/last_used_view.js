/* ============================================================
   Mi Ganado PRO — Feature: último utilizado (vista)
   js/features/last_used/last_used_view.js
   ------------------------------------------------------------
   Marca la tarjeta del último tipo de pago y del último
   servicio usados: borde grueso + pestaña que sobresale.
   Solo en el paso 2 y en el paso 3.
   ============================================================ */

import { getElements } from '../../core/core_dom.js';
import { readLastUsed } from './last_used_store.js';

const TAB_CLASS = 'last-used-tab';
const CARD_CLASS = 'is-last-used';

// true si la clave coincide con la del último comprobante enviado
export function isLastUsed(kind, key)
{
  const lastUsed = readLastUsed();

  if (!lastUsed || !key) return false;

  const expected = kind === 'category' ? lastUsed.categoryKey : lastUsed.serviceKey;

  return !!expected && expected === key;
}

// Pestaña que sobresale por encima del borde de la tarjeta
export function buildLastUsedTab()
{
  return `<span class="${TAB_CLASS}"><svg class="icon icon-xs" aria-hidden="true"><use href="#i-check"/></svg> Último utilizado</span>`;
}

function applyMarker(card, kind, key)
{
  const previousTab = card.querySelector(`.${TAB_CLASS}`);

  if (previousTab) previousTab.remove();

  card.classList.remove(CARD_CLASS);

  if (!isLastUsed(kind, key)) return;

  card.classList.add(CARD_CLASS);
  card.insertAdjacentHTML('afterbegin', buildLastUsedTab());
}

// Paso 2: las tarjetas están escritas en el HTML
export function renderCategoryLastUsed()
{
  const cards = getElements('.category-card[data-category]');

  cards.forEach
  (
    (card) =>
    {
      applyMarker(card, 'category', card.dataset.category);
    }
  );
}
