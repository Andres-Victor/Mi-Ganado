/* ============================================================
   Mi Ganado PRO — Núcleo: geolocalización y tasa regional
   js/core/core_geo.js
   ------------------------------------------------------------
   Detecta el país del visitante y resuelve la tasa de cambio.
   Toda respuesta pasa por el store: la interfaz se repinta
   sola al cambiar la moneda.
   ============================================================ */

import { CORE_CONFIG } from './core_config.js';
import { appState } from './core_state.js';
import { getCurrencyConfig, hasCurrency, setCurrencyRate } from './core_currency.js';
import { hideLoadingPopup } from './core_dom.js';
import { showLocalCategory } from '../features/payment_types/payment_types_view.js';

const MINUTE_MS = 1000 * 60;

function readCache(cacheKey, ttlMinutes)
{
  try
  {
    const raw = localStorage.getItem(cacheKey);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (!parsed || !parsed.ts) return null;

    const age = Date.now() - parsed.ts;

    if (age >= ttlMinutes * MINUTE_MS) return null;

    return parsed;
  }
  catch (error)
  {
    return null;
  }
}

function writeCache(cacheKey, payload)
{
  try
  {
    localStorage.setItem
    (
      cacheKey,
      JSON.stringify
      (
        Object.assign
        (
          {},
          payload,
          {
            ts: Date.now(),
          }
        )
      )
    );
  }
  catch (error)
  {
    // Almacenamiento no disponible: se ignora
  }
}

// Solo hay tasa regional para VES; el resto usa la tasa fija
export async function getRegionalPrice(fiatCurrency)
{
  if (fiatCurrency === 'USD') return 1;

  if (fiatCurrency !== 'VES') return null;

  const cacheKey = `${CORE_CONFIG.cache.ratePrefix}${fiatCurrency}`;
  const cached = readCache(cacheKey, CORE_CONFIG.cache.rateTtlMinutes);

  if (cached && cached.precio != null) return cached.precio;

  try
  {
    const url = `${CORE_CONFIG.endpoints.rate}?fiat=${fiatCurrency}&asset=USDT&tradeType=BUY`;
    const response = await fetch(url);

    if (!response.ok) throw new Error('Error en red');

    const data = await response.json();

    if (data.success && data.data && data.data.length > 0)
    {
      const precio = parseFloat(data.data[0].adv.price);

      if (Number.isNaN(precio)) return null;

      writeCache
      (
        cacheKey,
        {
          precio: precio,
        }
      );

      return precio;
    }

    if (data.success && data.source === 'fallback_firebase')
    {
      const precio = parseFloat(data.price);

      if (Number.isNaN(precio)) return null;

      writeCache
      (
        cacheKey,
        {
          precio: precio,
        }
      );

      return precio;
    }

    return null;
  }
  catch (error)
  {
    console.error('Error en la petición:', error);

    return null;
  }
}

async function applyCountry(countryCode)
{
  const resolvedCode = hasCurrency(countryCode) ? countryCode : 'US';

  if (hasCurrency(countryCode))
  {
    const regionalRate = await getRegionalPrice(getCurrencyConfig(countryCode).label);

    if (regionalRate) setCurrencyRate(countryCode, regionalRate);
  }

  appState.update
  (
    {
      currency: resolvedCode,
    }
  );

  if (countryCode === 'VE') showLocalCategory();

  hideLoadingPopup();
}

export async function detectUserCountry()
{
  try
  {
    const cached = readCache(CORE_CONFIG.cache.geoKey, CORE_CONFIG.cache.geoTitleMinutes);

    if (cached && cached.countryCode)
    {
      await applyCountry(cached.countryCode);

      return;
    }

    const response = await fetch(CORE_CONFIG.endpoints.geo);
    const data = await response.json();
    const countryCode = data.countryCode;

    writeCache
    (
      CORE_CONFIG.cache.geoKey,
      {
        countryCode: countryCode,
      }
    );

    await applyCountry(countryCode);
  }
  catch (error)
  {
    // Por defecto VES si falla la geolocalización
    await applyCountry('VE');
  }
}
