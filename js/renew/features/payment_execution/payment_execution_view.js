/* ============================================================
   Mi Ganado PRO — Feature: ejecución del pago (vista)
   js/features/payment_execution/payment_execution_view.js
   ------------------------------------------------------------
   Paso 4: instrucciones, datos copiables o botón de acción,
   más el color propio del método.
   ============================================================ */

import { appState } from '../../core/core_state.js';
import { getElement, setupLogoFallbacks } from '../../core/core_dom.js';
import { listMethodThemes } from '../../methods/methods_registry.js';
import { buildLogo } from '../../methods/methods_logo.js';
import { renderVerificationHeader } from '../verification/verification_view.js';

function clearPaymentData(container)
{
  const nodes = container.querySelectorAll('.bank-info-row, .method-action-btn');

  nodes.forEach
  (
    (node) =>
    {
      node.remove();
    }
  );
}

function buildDataRow(row)
{
  const element = document.createElement('div');

  element.className = 'bank-info-row';
  element.innerHTML = `
        <span class="bank-info-label">${row.label}:</span>
        <span class="bank-info-right">
            <span class="bank-info-value">${row.value}</span>
            <button type="button" class="copy-button" data-action="copy-value" data-copy="${row.value}">Copiar</button>
        </span>`;

  return element;
}

function buildActionButton(method)
{
  const amount = Math.round((appState.membership === 'monthly' ? appState.prices.monthly : appState.prices.annual) * 100) / 100;
  const link = method.buildActionLink(amount);
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'method-action-btn';
  button.addEventListener
  (
    'click',
    () =>
    {
      window.open(link, '_blank', 'noopener');
    }
  );

  button.innerHTML = `
        <span class="ma-logo">${buildLogo(method.logo)}</span>
        <span class="ma-body">
            <span class="ma-main">
                <span class="ma-title">${method.getActionLabel()}</span>
                <span class="ma-amount">US$ ${amount.toFixed(2)}</span>
            </span>
            <span class="ma-sub">${method.getActionCaption()} · se abre en una pestaña nueva ↗</span>
        </span>`;

  return button;
}

function renderPaymentData(method)
{
  const container = getElement('bankInfo');

  if (!container) return;

  clearPaymentData(container);

  if (method.dataRows.length === 0 && !method.action)
  {
    container.style.display = 'none';

    return;
  }

  container.style.display = 'block';

  const titleElement = container.querySelector('h4');

  if (titleElement) titleElement.textContent = method.getDataTitle();

  method.dataRows.forEach
  (
    (row) =>
    {
      container.appendChild(buildDataRow(row));
    }
  );

  if (method.action) container.appendChild(buildActionButton(method));
}

function renderInstructions(method)
{
  const list = getElement('instructionsList');

  if (!list) return;

  list.innerHTML = method.instructions.map
  (
    (text) =>
    {
      return `<li>${text}</li>`;
    }
  ).join('');
}

const REFUND_NOTICE_ID = 'refundNotice';
const COMMISSION_NOTICE_ID = 'commissionNotice';

function buildNotice
(
  {
    id,
    tone,
    icon,
    title,
    text,
  }
)
{
  const notice = document.createElement('div');

  notice.id = id;
  notice.className = `payment-notice ${tone}`;
  notice.innerHTML = `
        <div class="payment-notice-icon"><svg class="icon" aria-hidden="true"><use href="#${icon}"/></svg></div>
        <div class="payment-notice-body">
            <h4 class="payment-notice-title">${title}</h4>
            <p class="payment-notice-text">${text}</p>
        </div>`;

  return notice;
}

// Tres casos, en este orden de prioridad:
// 1. Reembolso con condiciones propias (customRefoundReason)
// 2. Sin reembolsos (noRefoundsReason)
// 3. Reembolso normal
function resolveRefundNotice(method)
{
  if (method.hasCustomRefoundReason())
  {
    return {
      tone: 'is-info',
      icon: 'i-sync',
      title: 'Reembolso con condiciones',
      text: method.customRefoundReason,
    };
  }

  if (method.hasNoRefoundsReason())
  {
    return {
      tone: 'is-blocked',
      icon: 'i-lock',
      title: 'Este método no admite reembolsos',
      text: method.noRefoundsReason,
    };
  }

  return {
    tone: 'is-allowed',
    icon: 'i-shield',
    title: 'Respira tranquilo',
    text: 'Este servicio de pago permite reembolsos.',
  };
}

function buildCommissionNotice(method)
{
  return buildNotice
  (
    {
      id: COMMISSION_NOTICE_ID,
      tone: 'is-info',
      icon: 'i-percent',
      title: 'Comisión del servicio',
      text: `${method.name} aplica una comisión de ${method.serviceComission} al procesar el pago.`,
    }
  );
}

// Recuadros justo después de las instrucciones:
// comisión (si aplica) y luego la política de reembolsos
function renderNotices(method)
{
  const section = getElement('payment-form-section');

  if (!section) return;

  [REFUND_NOTICE_ID, COMMISSION_NOTICE_ID].forEach
  (
    (id) =>
    {
      const existing = getElement(id);

      if (existing) existing.remove();
    }
  );

  const instructions = section.querySelector('.pay-instructions');

  if (!instructions) return;

  let anchor = instructions;

  if (method.hasServiceComission())
  {
    const commissionNotice = buildCommissionNotice(method);

    anchor.insertAdjacentElement('afterend', commissionNotice);
    anchor = commissionNotice;
  }

  anchor.insertAdjacentElement
  (
    'afterend',
    buildNotice
    (
      Object.assign
      (
        {
          id: REFUND_NOTICE_ID,
        },
        resolveRefundNotice(method),
      )
    ),
  );
}

// Aplica el color del método a las pantallas 4 y 5
function applyMethodTheme(theme)
{
  const themes = listMethodThemes();

  ['screen4', 'screen5'].forEach
  (
    (screenId) =>
    {
      const screen = getElement(screenId);

      if (!screen) return;

      themes.forEach
      (
        (themeName) =>
        {
          screen.classList.remove(themeName);
        }
      );

      if (theme) screen.classList.add(theme);
    }
  );
}

export function renderPaymentScreen(method)
{
  const title = getElement('payStepTitle');

  if (title) title.textContent = `Paga con ${method.name}`;

  renderInstructions(method);
  renderNotices(method);
  renderPaymentData(method);
  applyMethodTheme(method.theme);
  renderVerificationHeader(method);
  setupLogoFallbacks();
}
