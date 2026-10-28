/* ============================================================
   Mi Ganado PRO — Feature: último utilizado (almacén)
   js/features/last_used/last_used_store.js
   ------------------------------------------------------------
   Recuerda el tipo de pago y el servicio con los que el usuario
   envió su último comprobante. Se guarda en localStorage.
   Si el navegador lo bloquea (modo privado, permisos), todo
   falla en silencio: el checkout nunca se rompe por esto.
   ============================================================ */

const STORAGE_KEY = 'miganado:lastPayment:v1';

function getStorage()
{
  try
  {
    return window.localStorage || null;
  }
  catch (error)
  {
    return null;
  }
}

// Devuelve { categoryKey, serviceKey } o null si no hay nada.
// No guarda fecha, ni monto, ni referencia: nada del comprobante.
export function readLastUsed()
{
  const storage = getStorage();

  if (!storage) return null;

  try
  {
    const raw = storage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') return null;

    return {
      categoryKey: parsed.categoryKey || null,
      serviceKey: parsed.serviceKey || null,
    };
  }
  catch (error)
  {
    return null;
  }
}

export function saveLastUsed(categoryKey, serviceKey)
{
  const storage = getStorage();

  if (!storage) return false;

  try
  {
    storage.setItem
    (
      STORAGE_KEY,
      JSON.stringify
      (
        {
          categoryKey: categoryKey || null,
          serviceKey: serviceKey || null,
        }
      ),
    );

    return true;
  }
  catch (error)
  {
    return false;
  }
}

export function clearLastUsed()
{
  const storage = getStorage();

  if (!storage) return;

  try
  {
    storage.removeItem(STORAGE_KEY);
  }
  catch (error)
  {
    // Sin acción: borrar la marca no es crítico
  }
}
