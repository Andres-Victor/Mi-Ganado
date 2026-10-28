/* ============================================================
   Mi Ganado PRO — Feature: soporte
   js/features/support/support_controller.js
   ============================================================ */

import { CORE_CONFIG } from '../../core/core_config.js';
import { getElement } from '../../core/core_dom.js';

export function showReviewPopup()
{
  const popup = getElement('reviewPopup');

  if (!popup) return;

  popup.classList.add('active');
}

export function closePage()
{
  window.location.href = 'index.html';
}

export function contactSupport()
{
  if (!CORE_CONFIG.supportWhatsapp)
  {
    window.open('contactUs.html', '_blank');

    return;
  }

  const message = encodeURIComponent('Hola, tengo un problema con el pago de mi membresía Mi Ganado PRO');

  window.open(`https://wa.me/${CORE_CONFIG.supportWhatsapp}?text=${message}`, '_blank');
}
