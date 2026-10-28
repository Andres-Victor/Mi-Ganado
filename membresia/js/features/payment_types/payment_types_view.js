/* ============================================================
   Mi Ganado PRO — Feature: tipos de pago (vista)
   js/features/payment_types/payment_types_view.js
   ------------------------------------------------------------
   El paso 2 está escrito en el HTML. Aquí solo se controla la
   visibilidad de "Moneda Local" y el nombre de la categoría
   que se muestra en el paso 3.
   ============================================================ */

import { getElement, setText } from '../../core/core_dom.js';

// La categoría "Moneda Local" (PagoMóvil) solo se muestra en Venezuela
export function showLocalCategory()
{
  const element = getElement('category-local');

  if (!element) return;

  element.style.display = 'flex';
}

export function renderCategoryName(categoryName)
{
  setText('categoryName', categoryName);
}
