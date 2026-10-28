/* ============================================================
   Mi Ganado PRO — Feature: verificación (servicio)
   js/features/verification/verification_service.js
   ------------------------------------------------------------
   Valida el formulario y envía el comprobante al webhook.
   Las validaciones se derivan de los formFields del método.
   ============================================================ */

import { getDiscordWebhookUrl } from '../../core/core_config.js';
import { appState } from '../../core/core_state.js';
import { computeMembershipAmounts } from '../../core/core_currency.js';
import { getElement, hideLoadingPopup, showLoadingPopup } from '../../core/core_dom.js';
import { getPaymentMethod } from '../../methods/methods_registry.js';
import { saveLastUsed } from '../last_used/last_used_store.js';
import { saveEmail } from './last_email_store.js';
import { showReviewPopup } from '../support/support_controller.js';

function readVerificationForm()
{
  const fileInput = getElement('file-upload');
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;
  const miGanadoEmailElement = getElement('email');
  const emisorEmailElement = getElement('email-emisor');
  const referenceElement = getElement('reference-code');
  const dateElement = getElement('payment-date');

  return {
    file: file,
    miGanadoEmail: miGanadoEmailElement ? miGanadoEmailElement.value.trim() : '',
    emisorEmail: emisorEmailElement ? emisorEmailElement.value.trim() : '',
    referenceCode: referenceElement ? referenceElement.value.trim() : '',
    paymentDate: dateElement ? dateElement.value : '',
  };
}

function validateForm(method, values)
{
  if (!values.paymentDate)
  {
    return 'Por favor indica la fecha y hora en que realizaste el pago';
  }

  if (method.hasFormField('miGanadoEmail') && !values.miGanadoEmail)
  {
    return 'Por favor indica tu correo de Mi Ganado';
  }

  const needsProof = method.hasFormField('referenceCode') || method.hasFormField('receipt');

  if (needsProof && !values.file && !values.referenceCode)
  {
    return 'Por favor incluye el número de transacción o un comprobante de pago';
  }

  if (method.hasFormField('emisorEmail') && !values.emisorEmail)
  {
    return 'Por favor indica el correo electrónico de la cuenta con la que realizó el pago';
  }

  return null;
}

// "2026-10-27T22:20" -> "27/10/2026 22:20"
function formatPaymentDate(value)
{
  const parts = String(value || '').split('T');
  const dateParts = parts[0].split('-');

  if (dateParts.length !== 3) return value || 'N/A';

  const readableDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  const readableTime = parts[1] ? ` ${parts[1].slice(0, 5)}` : '';

  return `${readableDate}${readableTime}`;
}

function buildAmountLabel()
{
  const amounts = computeMembershipAmounts();
  const usdAmount = Math.round(amounts.usdAmount * 100) / 100;
  const rate = amounts.rate;
  let convertedAmount = Math.round(usdAmount * rate.rate * 100) / 100;

  if (rate.rounded)
  {
    convertedAmount = Math.round(convertedAmount / 10) * 10;
  }

  return `${rate.symbol} ${convertedAmount} (USD ${usdAmount})`;
}

function buildEmbedPayload(method, values)
{
  return {
    embeds:
    [
      {
        title: '✨ Pago registrado',
        description: 'Se ha recibido un comprobante para activación o renovación.',
        color: 65280,
        fields:
        [
          { name: '📧 Email Emisor', value: values.emisorEmail || 'N/A', inline: true },
          { name: '📧 Email Mi Ganado', value: values.miGanadoEmail || 'N/A', inline: true },
          { name: '🔢 Ref.', value: values.referenceCode || 'N/A', inline: true },
          { name: '📆 Fecha', value: formatPaymentDate(values.paymentDate), inline: true },
          { name: '💳 Método', value: method.name, inline: true },
          { name: '🏷️ Membresía', value: appState.membership, inline: true },
          { name: '💱 Moneda', value: appState.currency, inline: true },
          { name: '💰 Monto', value: buildAmountLabel(), inline: true },
        ],
        footer:
        {
          text: 'Mi Ganado Web - Activación/Renovación',
        },
        timestamp: new Date().toISOString(),
      }
    ],
  };
}

export async function executePayment()
{
  const method = getPaymentMethod(appState.serviceKey);

  if (!method)
  {
    alert('Por favor selecciona un servicio de pago');

    return;
  }

  const values = readVerificationForm();
  const validationError = validateForm(method, values);

  if (validationError)
  {
    alert(validationError);

    return;
  }

  // El comprobante se envía: recordamos el tipo, el servicio y el correo de Mi Ganado
  saveLastUsed(appState.paymentCategory, appState.serviceKey);
  saveEmail(values.miGanadoEmail);

  const formData = new FormData();

  if (values.file) formData.append('file', values.file, 'comprobante.png');

  formData.append('payload_json', JSON.stringify(buildEmbedPayload(method, values)));

  showLoadingPopup();

  try
  {
    const response = await fetch
    (
      getDiscordWebhookUrl(),
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) throw new Error('Error al enviar al webhook');

    showReviewPopup();
  }
  catch (error)
  {
    console.error('Error:', error);
    alert('Error al procesar el envío. Intente de nuevo.');
  }
  finally
  {
    hideLoadingPopup();
  }
}
