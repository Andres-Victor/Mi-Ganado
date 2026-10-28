/* ============================================================
   Mi Ganado PRO — Feature: servicios de pago (vista)
   js/features/payment_services/payment_services_view.js
   ------------------------------------------------------------
   Dibuja las tarjetas del paso 3 a partir del registro de
   métodos. No hay ninguna lista escrita a mano.
   ============================================================ */

import { getElement, setupLogoFallbacks } from '../../core/core_dom.js';
import { listMethodsByCategory } from '../../methods/methods_registry.js';
import { buildLogo } from '../../methods/methods_logo.js';
import { buildLastUsedTab, isLastUsed } from '../last_used/last_used_view.js';

function buildComingSoonCard(method)
{
  const logoHtml = buildLogo(method.logo);

  return `
    <div class="payment-option ${method.theme} coming-soon" aria-disabled="true">
        <div class="payment-top">
            <div class="payment-icon">${logoHtml}</div>
            <span class="payment-badge"><svg class="icon icon-xs" aria-hidden="true"><use href="#${method.badge.icon}"/></svg> ${method.badge.text}</span>
        </div>
        <h3>${method.name} <span class="flag-tag">Pronto</span></h3>
        <p>${method.desc}</p>
    </div>`;
}

function buildAvailableCard(method)
{
  const logoHtml = buildLogo(method.logo);
  const lastUsed = isLastUsed('service', method.key);
  const cardClass = lastUsed ? `payment-option ${method.theme} is-last-used` : `payment-option ${method.theme}`;

  return `
    <div class="${cardClass}" data-action="service-select" data-service="${method.key}" role="button" tabindex="0" aria-label="Pagar con ${method.name}">
        ${lastUsed ? buildLastUsedTab() : ''}
        <div class="payment-top">
            <div class="payment-icon">${logoHtml}</div>
            <span class="payment-badge"><svg class="icon icon-xs" aria-hidden="true"><use href="#${method.badge.icon}"/></svg> ${method.badge.text}</span>
        </div>
        <h3>${method.name}</h3>
        <p>${method.desc}</p>
    </div>`;
}

export function renderServiceList(categoryKey)
{
  const list = getElement('servicesList');

  if (!list) return;

  const methods = listMethodsByCategory(categoryKey);

  list.innerHTML = methods.map
  (
    (method) =>
    {
      if (method.comingSoon) return buildComingSoonCard(method);

      return buildAvailableCard(method);
    }
  ).join('');

  // Vuelve a aplicar los respaldos de logo para el contenido nuevo
  setupLogoFallbacks(list);
}
