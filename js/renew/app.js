/* ============================================================
   Mi Ganado PRO — Activación / Renovación
   js/app.js
   ------------------------------------------------------------
   Punto de arranque. Registra los métodos de pago, conecta el
   estado con las vistas y lanza la inicialización.
   ============================================================ */

import { CORE_CONFIG } from './core/core_config.js';
import { appState } from './core/core_state.js';
import { detectUserCountry } from './core/core_geo.js';
import { getElement, setTextAll, setupKeyboardActivation, setupLogoFallbacks } from './core/core_dom.js';
import { registerAllPaymentMethods } from './methods/methods_index.js';
import { setupActions } from './features/actions/actions_router.js';
import { renderPlans } from './features/plans/plans_view.js';
import { renderOrderSummary } from './features/order_summary/order_summary_view.js';
import { renderCategoryLastUsed } from './features/last_used/last_used_view.js';
import { handleFileSelect, setupDragDrop } from './features/verification/verification_view.js';
import { readSavedEmail } from './features/verification/last_email_store.js';

// La fecha y hora de pago arrancan en el momento actual, nunca en un valor guardado
function setDefaultPaymentDate()
{
  const dateInput = getElement('payment-date');

  if (!dateInput) return;

  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  const datePart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const timePart = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  dateInput.value = `${datePart}T${timePart}`;
}

// Solo el correo de Mi Ganado se recuerda entre visitas
function restoreSavedEmail()
{
  const emailInput = getElement('email');
  const savedEmail = readSavedEmail();

  if (!emailInput || !savedEmail || emailInput.value) return;

  emailInput.value = savedEmail;
}

function initDefaults()
{
  const yearElement = getElement('footer-year');

  if (yearElement) yearElement.textContent = new Date().getFullYear();

  setTextAll('.js-minutes', CORE_CONFIG.activationMinutes);

  if (!CORE_CONFIG.supportWhatsapp) setTextAll('.wa-label', 'Contactar Soporte');

  setDefaultPaymentDate();
  restoreSavedEmail();

  const fileInput = getElement('file-upload');

  if (fileInput)
  {
    fileInput.addEventListener
    (
      'change',
      (event) =>
      {
        handleFileSelect(event.target);
      }
    );
  }

  setupDragDrop();
  setupLogoFallbacks();
  renderCategoryLastUsed();
}

// El store avisa y las vistas se repintan solas
function setupStateSubscription()
{
  appState.subscribe
  (
    () =>
    {
      renderPlans();
      renderOrderSummary();
    }
  );
}

function bootstrap()
{
  registerAllPaymentMethods();
  initDefaults();
  setupActions();
  setupKeyboardActivation();
  setupStateSubscription();
  detectUserCountry();
}

if (document.readyState === 'loading')
{
  document.addEventListener('DOMContentLoaded', bootstrap);
}
else
{
  bootstrap();
}
