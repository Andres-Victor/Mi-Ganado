/* ============================================================
   Mi Ganado PRO — Feature: verificación (controlador)
   js/features/verification/verification_controller.js
   ============================================================ */

import { appState } from '../../core/core_state.js';
import { getPaymentMethod } from '../../methods/methods_registry.js';
import { displayPaymentForm } from './verification_view.js';
import { showScreen } from '../navigation/navigation_controller.js';

// El usuario confirma que ya pagó y pasa a la verificación
export function confirmPaymentMade()
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
