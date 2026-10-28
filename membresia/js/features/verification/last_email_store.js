/* ============================================================
   Mi Ganado PRO — Feature: verificación (correo recordado)
   js/features/verification/last_email_store.js
   ------------------------------------------------------------
   Guarda únicamente el correo de Mi Ganado: es el único dato
   constante en todos los comprobantes de pago. El resto del
   formulario (referencia, fecha, imagen) no se guarda nunca.
   Si el navegador bloquea localStorage, falla en silencio.
   ============================================================ */

const STORAGE_KEY = 'miganado:lastEmail:v1';

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

export function readSavedEmail()
{
  const storage = getStorage();

  if (!storage) return '';

  try
  {
    return storage.getItem(STORAGE_KEY) || '';
  }
  catch (error)
  {
    return '';
  }
}

export function saveEmail(email)
{
  const storage = getStorage();
  const cleanEmail = String(email || '').trim();

  if (!storage || !cleanEmail) return false;

  try
  {
    storage.setItem(STORAGE_KEY, cleanEmail);

    return true;
  }
  catch (error)
  {
    return false;
  }
}

export function clearSavedEmail()
{
  const storage = getStorage();

  if (!storage) return;

  try
  {
    storage.removeItem(STORAGE_KEY);
  }
  catch (error)
  {
    // Sin acción: borrar el correo no es crítico
  }
}
