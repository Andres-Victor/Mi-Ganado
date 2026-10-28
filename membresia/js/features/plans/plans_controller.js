/* ============================================================
   Mi Ganado PRO — Feature: planes (controlador)
   js/features/plans/plans_controller.js
   ------------------------------------------------------------
   Solo cambia el estado. El repintado lo hace la suscripción
   del store en app.js.
   ============================================================ */

import { appState } from '../../core/core_state.js';
import { goToStep2 } from '../navigation/navigation_controller.js';

export function selectMembership(membershipType)
{
  appState.update
  (
    {
      membership: membershipType,
    }
  );
}

// Botón "Elegir" de cada plan: selecciona y avanza al paso 2
export function choosePlan(membershipType)
{
  selectMembership(membershipType);
  goToStep2();
}
