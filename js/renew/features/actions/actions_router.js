/* ============================================================
   Mi Ganado PRO — Feature: acciones
   js/features/actions/actions_router.js
   ------------------------------------------------------------
   Un único listener delega los clics según data-action.
   Al añadir un método de pago NO hay que tocar este archivo:
   sus tarjetas usan acciones que ya existen.
   ============================================================ */

import { appState } from '../../core/core_state.js';
import { copyToClipboard } from '../../core/core_dom.js';
import { getPaymentMethod } from '../../methods/methods_registry.js';
import { goToStep, goToStep4 } from '../navigation/navigation_controller.js';
import { choosePlan } from '../plans/plans_controller.js';
import { selectPaymentCategory } from '../payment_types/payment_types_controller.js';
import { confirmPaymentMade } from '../verification/verification_controller.js';
import { executePayment } from '../verification/verification_service.js';
import { closePage, contactSupport } from '../support/support_controller.js';

function selectService(serviceKey)
{
  const method = getPaymentMethod(serviceKey);

  if (!method || !method.isAvailable()) return;

  appState.update
  (
    {
      serviceKey: method.key,
      serviceName: method.name,
    }
  );

  goToStep4();
}

const ACTION_HANDLERS =
{
  'plan-choose':
  (element) =>
  {
    choosePlan(element.dataset.plan);
  },

  'goto-step':
  (element) =>
  {
    goToStep(element.dataset.step);
  },

  'category-select':
  (element) =>
  {
    selectPaymentCategory(element.dataset.category);
  },

  'service-select':
  (element) =>
  {
    selectService(element.dataset.service);
  },

  'contact-support':
  () =>
  {
    contactSupport();
  },

  'confirm-payment':
  () =>
  {
    confirmPaymentMade();
  },

  'submit-payment':
  () =>
  {
    executePayment();
  },

  'close-page':
  () =>
  {
    closePage();
  },

  'copy-value':
  (element) =>
  {
    copyToClipboard(element.dataset.copy, element);
  },
};

export function setupActions()
{
  document.addEventListener
  (
    'click',
    (event) =>
    {
      const target = event.target && event.target.closest ? event.target.closest('[data-action]') : null;

      if (!target) return;

      const handler = ACTION_HANDLERS[target.dataset.action];

      if (!handler) return;

      if (target.tagName === 'A') event.preventDefault();

      handler(target);
    }
  );
}
