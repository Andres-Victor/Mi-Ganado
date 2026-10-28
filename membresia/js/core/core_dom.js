/* ============================================================
   Mi Ganado PRO — Núcleo: utilidades de DOM
   js/core/core_dom.js
   ------------------------------------------------------------
   Helpers de selección, textos, popups de carga, portapapeles,
   respaldo de logos y activación por teclado.
   ============================================================ */

export function getElement(elementId)
{
  return document.getElementById(elementId);
}

export function getElements(selector, root = document)
{
  return Array.from(root.querySelectorAll(selector));
}

export function setText(elementId, text)
{
  const element = getElement(elementId);

  if (!element) return;

  element.textContent = text;
}

export function setTextAll(selector, text)
{
  getElements(selector).forEach
  (
    (element) =>
    {
      element.textContent = text;
    }
  );
}

export function showLoadingPopup()
{
  const popup = getElement('loadingPopup');

  if (!popup) return;

  popup.classList.remove('hidden');
  popup.style.display = 'flex';
}

export function hideLoadingPopup()
{
  const popup = getElement('loadingPopup');

  if (!popup) return;

  popup.classList.add('hidden');

  setTimeout
  (
    () =>
    {
      popup.style.display = 'none';
    },
    300,
  );
}

export function copyToClipboard(text, button)
{
  navigator.clipboard.writeText(text)
    .then
    (
      () =>
      {
        if (!button) return;

        const originalText = button.textContent;

        button.textContent = '✓ Copiado';

        setTimeout
        (
          () =>
          {
            button.textContent = originalText;
          },
          2000,
        );
      }
    )
    .catch
    (
      (error) =>
      {
        console.log('Copy error:', error);
      }
    );
}

// Si una imagen con data-fallback="LETRA|COLOR" no carga,
// se reemplaza por un cuadro con la inicial.
export function setupLogoFallbacks(root = document)
{
  getElements('img[data-fallback]', root).forEach
  (
    (image) =>
    {
      if (image.dataset.fallbackBound) return;

      image.dataset.fallbackBound = 'true';

      const applyFallback = () =>
      {
        const parts = (image.dataset.fallback || '?|#5c7186').split('|');
        const box = document.createElement('div');

        box.className = 'logo-fallback';
        box.style.background = parts[1];
        box.textContent = parts[0];

        if (image.replaceWith) image.replaceWith(box);
      };

      image.addEventListener
      (
        'error',
        applyFallback,
        {
          once: true,
        }
      );

      if (image.complete && image.naturalWidth === 0) applyFallback();
    }
  );
}

// Enter y espacio activan cualquier elemento con data-action
export function setupKeyboardActivation()
{
  document.addEventListener
  (
    'keydown',
    (event) =>
    {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      const target = event.target && event.target.closest ? event.target.closest('[data-action]') : null;

      if (!target) return;

      event.preventDefault();
      target.click();
    }
  );
}
