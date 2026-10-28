/* ============================================================
   Mi Ganado PRO — Feature: tipos de pago (controlador)
   js/features/payment_types/payment_types_controller.js
   ============================================================ */

import { appState } from '../../core/core_state.js';
import { showScreen } from '../navigation/navigation_controller.js';
import { renderServiceList } from '../payment_services/payment_services_view.js';
import { renderCategoryName } from './payment_types_view.js';
import { getCategoryName, isKnownCategory } from '../../methods/methods_registry.js';

export function selectPaymentCategory(categoryKey)
{
  if (!isKnownCategory(categoryKey)) return;

  appState.update
  (
    {
      paymentCategory: categoryKey,
    }
  );

  renderCategoryName(getCategoryName(categoryKey));
  renderServiceList(categoryKey);
  showScreen(3);
}
