/* ============================================================
   Mi Ganado PRO — Núcleo: configuración
   js/core/core_config.js
   ------------------------------------------------------------
   Única fuente de verdad para los valores ajustables: soporte,
   tiempos de activación, endpoints, precios base y webhook.
   ============================================================ */

export const CORE_CONFIG =
{
  // Número de WhatsApp de soporte (solo dígitos con código de país).
  // Si se deja vacío se usa contactUs.html.
  supportWhatsapp: '',

  // Tiempo promedio de activación mostrado al usuario (minutos)
  activationMinutes: 30,

  // Precios base en USD
  prices:
  {
    monthly: 7.99,
    annual: 59.99,
  },

  // Endpoints de geolocalización y tasa de cambio
  endpoints:
  {
    geo: 'https://miganado-geo.vianvarela.workers.dev/',
    rate: 'https://script.google.com/macros/s/AKfycbyWbKTJmxSo1U2BfBN6GxxYUXoQvIHybMPblt0pLFwyWGjMJ18Q5jbvj59dwkSuBhDc9A/exec',
  },

  // Webhook de comprobantes (Discord), partido en tres segmentos
  webhookSegments:
  {
    one: 'https://disc',
    two: 'ord.com/api/webhooks/1508654073472221367/',
    three: 'eHtJdnFrltE5SZQahbvD4cnKgjfiIGFtfbkpu4Ek2m_oYyDGecFkJ-ETK_InjRtge1aI',
  },

  // Caché local
  cache:
  {
    geoKey: 'user_location',
    geoTitleMinutes: 60,
    ratePrefix: 'budt_',
    rateTtlMinutes: 60,
  },
};

export function getDiscordWebhookUrl()
{
  const segments = CORE_CONFIG.webhookSegments;

  return segments.one + segments.two + segments.three;
}
