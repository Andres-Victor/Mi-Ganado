/* ============================================================
   Mi Ganado PRO — Feature: navegación
   js/features/navigation/navigation_controller.js
   ------------------------------------------------------------
   Cambio de pantalla y estado del indicador de 5 pasos.
   ============================================================ */

import { appState } from '../../core/core_state.js';
import { getElement } from '../../core/core_dom.js';
import { getPaymentMethod } from '../../methods/methods_registry.js';
import { renderPaymentScreen } from '../payment_execution/payment_execution_view.js';
import { renderOrderSummary } from '../order_summary/order_summary_view.js';
import { displayPaymentForm } from '../verification/verification_view.js';

const TOTAL_STEPS = 5;
const TOTAL_CONNECTORS = 4;

function renderStepIndicator(screenNumber)
{
  for (let index = 1; index <= TOTAL_STEPS; index++)
  {
    const indicator = getElement(`step${index}-indicator`);

    if (!indicator) continue;

    const numberElement = indicator.querySelector('.step-number');

    if (index === screenNumber)
    {
      indicator.classList.add('active');
      indicator.classList.remove('done');
      numberElement.textContent = String(index);

      continue;
    }

    if (index < screenNumber)
    {
      indicator.classList.add('done');
      indicator.classList.remove('active');
      numberElement.textContent = '✓';

      continue;
    }

    indicator.classList.remove('done', 'active');
    numberElement.textContent = String(index);
  }
}

function renderConnectors(screenNumber)
{
  for (let index = 1; index <= TOTAL_CONNECTORS; index++)
  {
    const connector = getElement(`connector-${index}`);

    if (!connector) continue;

    connector.classList.toggle('done', screenNumber > index);
  }
}

export function showScreen(screenNumber)
{
  document.querySelectorAll('.screen').forEach
  (
    (screen) =>
    {
      screen.classList.remove('active');
    }
  );

  document.querySelectorAll('.step').forEach
  (
    (step) =>
    {
      step.classList.remove('active');
    }
  );

  renderStepIndicator(screenNumber);
  renderConnectors(screenNumber);

  const screen = getElement(`screen${screenNumber}`);

  if (screen) screen.classList.add('active');

  // El hero desaparece por completo a partir del paso 2
  document.body.classList.toggle('no-hero', screenNumber > 1);

  window.scrollTo
  (
    {
      top: 0,
      behavior: 'smooth',
    }
  );
}

export function goToStep1()
{
  showScreen(1);
}

export function goToStep2()
{
  if (!appState.membership)
  {
    alert('Por favor selecciona una membresía');

    return;
  }

  showScreen(2);
}

export function goToStep3()
{
  if (!appState.paymentCategory)
  {
    alert('Por favor selecciona un tipo de pago');

    return;
  }

  showScreen(3);
}

export function goToStep4()
{
  const method = getPaymentMethod(appState.serviceKey);

  if (!method)
  {
    alert('Por favor selecciona un servicio de pago');

    return;
  }

  // Se vuelve a pintar por si el usuario cambió de plan
  renderPaymentScreen(method);
  renderOrderSummary();
  showScreen(4);
}

export function goToStep5()
{
  const method = getPaymentMethod(appState.serviceKey);

  if (!method)
  {
    alert('Por favor selecciona un servicio de pago');

    return;
  }

  displayPaymentForm(method);
  showScreen(5);
}

export function goToStep(stepNumber)
{
  switch (Number(stepNumber))
  {
    case 1:
      goToStep1();
      break;

    case 2:
      goToStep2();
      break;

    case 3:
      goToStep3();
      break;

    case 4:
      goToStep4();
      break;

    case 5:
      goToStep5();
      break;

    default:
      break;
  }
}
